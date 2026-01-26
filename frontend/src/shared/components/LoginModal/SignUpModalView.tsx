import { useState, useEffect } from "react";

import * as S from "./LoginModal.styles";

import googleIcon from "@/assets/image/Google.png";
import kakaoIcon from "@/assets/image/Kakao.png";
import axiosInstance from "@/shared/api/axios";

type EmailCheckResponse = {
  code: number;
  message: string;
  data: {
    hasEmail: boolean;
  };
};

type NicknameCheckResponse = {
  code: number;
  message: string;
  data: {
    hasNickname: boolean;
  };
};

type Props = {
  onSwitchToLogin: () => void;
};

export const SignUpModalView = ({ onSwitchToLogin }: Props) => {
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [authCode, setAuthCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nicknameCheckStatus, setNicknameCheckStatus] = useState<
    "idle" | "checking" | "available" | "taken" | "error"
  >("idle");
  const [emailCheckStatus, setEmailCheckStatus] = useState<
    "idle" | "checking" | "available" | "taken" | "invalid" | "error" | "verified"
  >("idle");
  const [emailVerified, setEmailVerified] = useState(false);

  // Timer logic (mock)
  const [timer, setTimer] = useState(180); // 3:00
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const trimmedEmail = email.trim();
  const isEmailFormatValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail);
  const showEmailFormatError =
    emailCheckStatus === "invalid" || (trimmedEmail.length > 0 && !isEmailFormatValid);

  const hasLetter = /[A-Za-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const isLengthValid = password.length >= 8 && password.length <= 16;
  const isPasswordValid = hasLetter && hasNumber && isLengthValid;
  const showPasswordMismatch =
    isPasswordValid && confirmPassword.length > 0 && password !== confirmPassword;
  const isSendDisabled = !isEmailFormatValid || emailCheckStatus === "checking" || emailVerified;

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timer]);

  const formatTime = (time: number) => {
    const min = Math.floor(time / 60);
    const sec = time % 60;
    return `0${min}:${sec < 10 ? `0${sec}` : sec}`;
  };

  const handleSendAuth = async () => {
    if (!isEmailFormatValid) {
      setEmailCheckStatus("invalid");
      return;
    }

    try {
      setEmailCheckStatus("checking");
      const { data } = await axiosInstance.get<EmailCheckResponse>("/auth/check/email", {
        params: { email: trimmedEmail },
      });
      const hasEmail = data?.data?.hasEmail;

      if (hasEmail) {
        setEmailCheckStatus("taken");
        return;
      }
    } catch (error) {
      console.log("TODO: Email Check Error", error);
      setEmailCheckStatus("taken");
      return;
    }

    try {
      await axiosInstance.post("/auth/email/validate", { email: trimmedEmail });
      setEmailCheckStatus("available");
      setIsTimerRunning(true);
      setTimer(180);
    } catch (error) {
      console.log("TODO: Send Auth Code Error", error);
      setEmailCheckStatus("error");
    }
  };

  const handleConfirmAuth = async () => {
    try {
      await axiosInstance.get("/auth/email/validate", {
        params: {
          email: trimmedEmail,
          code: authCode,
        },
      });
      setEmailVerified(true);
      setEmailCheckStatus("verified");
      setIsTimerRunning(false);
    } catch (error) {
      console.log("TODO: Confirm Auth Code Error", error);
    }
  };

  const handleCheckNickname = async () => {
    const trimmedNickname = nickname.trim();
    if (!trimmedNickname) {
      return;
    }

    try {
      setNicknameCheckStatus("checking");
      const { data } = await axiosInstance.get<NicknameCheckResponse>("/auth/check/nickname", {
        params: { nickname: trimmedNickname },
      });
      const hasNickname = data?.data?.hasNickname;
      setNicknameCheckStatus(hasNickname ? "taken" : "available");
    } catch (error) {
      console.log("TODO: Nickname Check Error", error);
      setNicknameCheckStatus("error");
    }
  };

  const handleSignUp = () => {
    console.log("TODO: Sign Up Submit", { nickname, email, password });
  };

  return (
    <S.SignUpCard>
      {/* LEFT: Illustration (Same as Login) */}
      <S.LeftPanel>
        <S.Shapes>
          <S.Hourglass />
          <S.Trapezoid />
          <S.TallRect />
        </S.Shapes>
      </S.LeftPanel>

      {/* Divider */}
      <S.Divider />

      {/* RIGHT: Sign Up Form */}
      <S.RightPanel>
        <S.Brand>
          <S.BrandTitle>BONE:TOBE</S.BrandTitle>
          <S.BrandSub>당신만의 골격을 완성하다</S.BrandSub>
        </S.Brand>

        <S.Form>
          <S.Field>
            <S.Label>닉네임</S.Label>
            <S.InputRow>
              <S.Input
                placeholder="닉네임을 입력하세요"
                value={nickname}
                onChange={(e) => {
                  setNickname(e.target.value);
                  setNicknameCheckStatus("idle");
                }}
                style={{ flex: 1 }}
              />
              <S.InputGroupBtn type="button" onClick={handleCheckNickname}>
                중복 확인
              </S.InputGroupBtn>
            </S.InputRow>
            {nicknameCheckStatus === "available" && (
              <S.SuccessText>
                <span className="material-symbols-outlined">check_circle</span>
                사용 가능한 닉네임입니다
              </S.SuccessText>
            )}
            {nicknameCheckStatus === "taken" && (
              <S.ValidationMessage $isError>이미 사용 중인 닉네임입니다</S.ValidationMessage>
            )}
            {nicknameCheckStatus === "error" && (
              <S.ValidationMessage $isError>닉네임 확인에 실패했습니다</S.ValidationMessage>
            )}
          </S.Field>

          <S.Field>
            <S.Label>이메일</S.Label>
            <S.InputRow>
              <S.Input
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailCheckStatus("idle");
                  setEmailVerified(false);
                  setIsTimerRunning(false);
                  setTimer(180);
                  setAuthCode("");
                }}
                style={{ flex: 1 }}
                disabled={emailVerified}
              />
              <S.InputGroupBtn type="button" onClick={handleSendAuth} disabled={isSendDisabled}>
                인증번호 전송
              </S.InputGroupBtn>
            </S.InputRow>
            {showEmailFormatError && (
              <S.ValidationMessage $isError>
                이메일 형식이 올바르지 않습니다
              </S.ValidationMessage>
            )}
            {emailVerified && (
              <S.SuccessText>
                <span className="material-symbols-outlined">check_circle</span>
                인증되었습니다
              </S.SuccessText>
            )}
            {!emailVerified && emailCheckStatus === "available" && (
              <S.SuccessText>
                <span className="material-symbols-outlined">check_circle</span>
                사용 가능한 이메일입니다
              </S.SuccessText>
            )}
            {emailCheckStatus === "taken" && (
              <S.ValidationMessage $isError>이미 사용 중인 이메일입니다</S.ValidationMessage>
            )}
            {emailCheckStatus === "error" && (
              <S.ValidationMessage $isError>인증번호 전송에 실패했습니다</S.ValidationMessage>
            )}
          </S.Field>

          {isTimerRunning && !emailVerified && (
            <S.InputRow>
              <S.TimerWrapper>
                <S.Input
                  placeholder="인증번호 6자리"
                  value={authCode}
                  onChange={(e) => setAuthCode(e.target.value)}
                />
                <S.TimerText>{formatTime(timer)}</S.TimerText>
              </S.TimerWrapper>
              <S.InputGroupBtn type="button" onClick={handleConfirmAuth}>
                확인
              </S.InputGroupBtn>
            </S.InputRow>
          )}

          <S.Field>
            <S.Label>비밀번호</S.Label>
            <S.Input
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <S.Hint>
              {hasLetter ? <S.HintOn>✓ 영문 포함</S.HintOn> : <span>✓ 영문 포함</span>}
              {hasNumber ? <S.HintOn>✓ 숫자 포함</S.HintOn> : <span>✓ 숫자 포함</span>}
              {isLengthValid ? <S.HintOn>✓ 8~16자</S.HintOn> : <span>✓ 8~16자</span>}
            </S.Hint>
          </S.Field>

          <S.Field>
            <S.Label>비밀번호 확인</S.Label>
            <S.Input
              type="password"
              placeholder="비밀번호를 다시 입력하세요"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={!isPasswordValid}
            />
            {showPasswordMismatch && (
              <S.ValidationMessage $isError>비밀번호가 일치하지 않습니다</S.ValidationMessage>
            )}
          </S.Field>

          <S.PrimaryButton type="button" onClick={handleSignUp} style={{ marginTop: "8px" }}>
            회원가입 완료
          </S.PrimaryButton>

          <S.OrRow style={{ marginTop: "20px" }}>
            <S.OrLine />
            <S.OrText
              style={{ fontSize: "10px", fontWeight: 900, letterSpacing: "0.22em", textTransform: "uppercase" }}
            >
              OR JOIN WITH
            </S.OrText>
            <S.OrLine />
          </S.OrRow>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "14px" }}>
            <S.SocialButton type="button">
              <img alt="Google" src={googleIcon} width={16} height={16} />
              <span>Google</span>
            </S.SocialButton>
            <S.SocialButtonKakao type="button">
              <img alt="Kakao" src={kakaoIcon} width={16} height={16} />
              <span>Kakao</span>
            </S.SocialButtonKakao>
          </div>

          <S.BottomLinks style={{ marginTop: "18px" }}>
            <S.LinkRow>
              <S.SmallText>이미 계정이 있으신가요?</S.SmallText>
              <S.LinkButton type="button" onClick={onSwitchToLogin}>
                로그인
              </S.LinkButton>
            </S.LinkRow>
          </S.BottomLinks>
        </S.Form>
      </S.RightPanel>
    </S.SignUpCard>
  );
};
