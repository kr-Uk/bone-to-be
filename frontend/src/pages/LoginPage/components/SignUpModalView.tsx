import { useEffect, useState } from "react";


import {
  checkEmail,
  checkNickname,
  confirmEmailValidation,
  sendEmailValidation,
  signup,
} from "../api/authApi";
import * as S from "../styles/LoginModal.styles";

import googleIcon from "@/assets/image/Google.png";
import kakaoIcon from "@/assets/image/Kakao.png";

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
    "idle" | "checking" | "available" | "taken" | "invalid" | "error"
  >("idle");
  const [emailCheckStatus, setEmailCheckStatus] = useState<
    "idle" | "checking" | "available" | "taken" | "invalid" | "error" | "verified"
  >("idle");
  const [emailVerified, setEmailVerified] = useState(false);
  const [authError, setAuthError] = useState("");

  // Timer logic (mock)
  const [timer, setTimer] = useState(180); // 3:00
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const trimmedEmail = email.trim();
  const isEmailFormatValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail);
  const showEmailFormatError =
    emailCheckStatus === "invalid" || (trimmedEmail.length > 0 && !isEmailFormatValid);

  const hasLetter = /[A-Za-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const isLengthValid = password.length >= 8 && password.length <= 12;
  const isPasswordValid = hasLetter && hasNumber && hasSpecial && isLengthValid;
  const showPasswordMismatch =
    isPasswordValid && confirmPassword.length > 0 && password !== confirmPassword;
  const isSendDisabled = !isEmailFormatValid || emailCheckStatus === "checking" || emailVerified;
  const trimmedNickname = nickname.trim();
  const hasInvalidNickname = /[ㄱ-ㅎㅏ-ㅣ]/.test(trimmedNickname);
  const nicknameFeedback =
    nicknameCheckStatus === "available"
      ? { text: "사용 가능한 닉네임입니다", isError: false }
      : nicknameCheckStatus === "taken"
        ? { text: "이미 사용 중인 닉네임입니다", isError: true }
        : nicknameCheckStatus === "invalid"
          ? { text: "올바르지 않은 닉네임입니다", isError: true }
          : nicknameCheckStatus === "error"
            ? { text: "닉네임 확인에 실패했습니다", isError: true }
            : null;
  const emailFeedback = showEmailFormatError
    ? { text: "이메일 형식이 올바르지 않습니다", isError: true }
    : emailVerified
      ? { text: "인증되었습니다", isError: false }
      : emailCheckStatus === "available"
        ? { text: "사용 가능한 이메일입니다", isError: false }
        : emailCheckStatus === "taken"
          ? { text: "이미 사용 중인 이메일입니다", isError: true }
          : emailCheckStatus === "error"
            ? { text: "인증번호 전송에 실패했습니다", isError: true }
            : null;
  const authFeedback = authError ? { text: authError, isError: true } : null;
  const shouldShowAuthBlock = (isTimerRunning && !emailVerified) || Boolean(authFeedback);
  const isAuthCodeComplete = authCode.trim().length === 6;
  const passwordFeedback = showPasswordMismatch
    ? { text: "비밀번호가 일치하지 않습니다", isError: true }
    : null;

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
      const data = await checkEmail(trimmedEmail);
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
      await sendEmailValidation(trimmedEmail);
      setEmailCheckStatus("available");
      setIsTimerRunning(true);
      setTimer(180);
    } catch (error) {
      console.log("TODO: Send Email Validation Error", error);
      setEmailCheckStatus("error");
    }
  };

  const handleConfirmAuth = async () => {
    try {
      setAuthError("");
      await confirmEmailValidation(trimmedEmail, authCode);
      setEmailVerified(true);
      setEmailCheckStatus("verified");
      setIsTimerRunning(false);
    } catch (error) {
      console.log("TODO: Confirm Email Validation Error", error);
      setAuthError("인증번호가 올바르지 않습니다");
    }
  };

  const handleCheckNickname = async () => {
    if (!trimmedNickname) {
      return;
    }
    if (hasInvalidNickname) {
      setNicknameCheckStatus("invalid");
      return;
    }

    try {
      setNicknameCheckStatus("checking");
      const data = await checkNickname(trimmedNickname);
      const hasNickname = data?.data?.hasNickname;
      setNicknameCheckStatus(hasNickname ? "taken" : "available");
    } catch (error) {
      console.log("TODO: Nickname Check Error", error);
      setNicknameCheckStatus("error");
    }
  };

  const handleSignUp = () => {
    const payload = {
      nickname: nickname.trim(),
      email: trimmedEmail,
      authCode,
      password,
      passwordConfirm: confirmPassword,
    };
    signup(payload)
      .then(() => {
        window.alert("회원가입이 완료되었습니다");
        onSwitchToLogin();
      })
      .catch((error) => {
        console.log("TODO: Sign Up Error", error);
      });
  };

  const handleGoogle = () => {
    window.location.href = "/api/oauth2/authorization/google";
  };
  const handleKakao = () => {
    window.location.href = "/api/oauth2/authorization/kakao";
  };
  return (
    <S.RightPanel>
      <S.Brand>
        <S.BrandTitle>회원가입</S.BrandTitle>
      </S.Brand>

      <S.Form>
        <S.Field>
          <S.Label>닉네임</S.Label>
          <S.InputRow>
            <S.Input
              placeholder="닉네임을 입력하세요"
              value={nickname}
              onChange={(e) => {
                const nextValue = e.target.value;
                const nextTrimmed = nextValue.trim();
                setNickname(nextValue);
                if (!nextTrimmed) {
                  setNicknameCheckStatus("idle");
                  return;
                }
                if (/[ㄱ-ㅎㅏ-ㅣ]/.test(nextTrimmed)) {
                  setNicknameCheckStatus("invalid");
                  return;
                }
                setNicknameCheckStatus("idle");
              }}
              style={{ flex: 1 }}
            />
            <S.InputGroupBtn type="button" onClick={handleCheckNickname}>
              중복 확인
            </S.InputGroupBtn>
          </S.InputRow>
          <S.ValidationMessage
            $isError={nicknameFeedback?.isError}
            style={{ visibility: nicknameFeedback ? "visible" : "hidden" }}
          >
            {nicknameFeedback ? (
              <>
                {!nicknameFeedback.isError && <span className="material-symbols-outlined">✓</span>}
                {nicknameFeedback.text}
              </>
            ) : (
              " "
            )}
          </S.ValidationMessage>
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
          <S.ValidationMessage
            $isError={emailFeedback?.isError}
            style={{ visibility: emailFeedback ? "visible" : "hidden" }}
          >
            {emailFeedback ? (
              <>
                {!emailFeedback.isError && <span className="material-symbols-outlined">✓</span>}
                {emailFeedback.text}
              </>
            ) : (
              " "
            )}
          </S.ValidationMessage>
        </S.Field>

        {shouldShowAuthBlock && (
          <div>
            {isTimerRunning && !emailVerified && (
              <S.InputRow>
                <S.TimerWrapper>
                  <S.Input
                    placeholder="인증번호 6자리"
                    value={authCode}
                    onChange={(e) => setAuthCode(e.target.value.slice(0, 6))}
                    maxLength={6}
                  />
                  <S.TimerText>{formatTime(timer)}</S.TimerText>
                </S.TimerWrapper>
                <S.InputGroupBtn
                  type="button"
                  onClick={handleConfirmAuth}
                  disabled={!isAuthCodeComplete}
                >
                  확인
                </S.InputGroupBtn>
              </S.InputRow>
            )}
            <S.ValidationMessage
              $isError={authFeedback?.isError}
              style={{ visibility: authFeedback ? "visible" : "hidden" }}
            >
              {authFeedback?.text ?? " "}
            </S.ValidationMessage>
          </div>
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
            {hasSpecial ? <S.HintOn>✓ 특수문자 포함</S.HintOn> : <span>✓ 특수문자 포함</span>}
            {isLengthValid ? <S.HintOn>✓ 8~12자</S.HintOn> : <span>✓ 8~12자</span>}
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
          <S.ValidationMessage
            $isError={passwordFeedback?.isError}
            style={{ visibility: passwordFeedback ? "visible" : "hidden" }}
          >
            {passwordFeedback?.text ?? " "}
          </S.ValidationMessage>
        </S.Field>

        <S.PrimaryButton type="button" onClick={handleSignUp} style={{ marginTop: "8px" }}>
          회원가입
        </S.PrimaryButton>

        <S.OrRow style={{ marginTop: "10px" }}>
          <S.OrLine />
          <S.OrText
            style={{
              fontSize: "10px",
              fontWeight: 900,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            간편 회원가입
          </S.OrText>
          <S.OrLine />
        </S.OrRow>

        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "5px" }}
        >
          <S.SocialButton type="button" onClick={handleGoogle}>
            <img alt="Google" src={googleIcon} width={16} height={16} />
            <span>Google</span>
          </S.SocialButton>
          <S.SocialButtonKakao type="button" onClick={handleKakao}>
            <img alt="Kakao" src={kakaoIcon} width={16} height={16} />
            <span>Kakao</span>
          </S.SocialButtonKakao>
        </div>

        <S.BottomLinks>
          <S.LinkRow>
            <S.SmallText>이미 계정이 있으신가요?</S.SmallText>
            <S.LinkButton type="button" onClick={onSwitchToLogin}>
              로그인
            </S.LinkButton>
          </S.LinkRow>
        </S.BottomLinks>
      </S.Form>
    </S.RightPanel>
  );
};
