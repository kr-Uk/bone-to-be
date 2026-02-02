import { useEffect, useMemo, useState } from "react";
import { FaCheck } from "react-icons/fa6";
import { LuLock } from "react-icons/lu";
import { useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";

import LoginHeader from "@/pages/LoginPage/components/LoginHeader";
import {
  Field,
  HelperText,
  Input,
  InputIcon,
  InputWrap,
  Label,
  LinkButton,
  PasswordFormCard,
  RuleItem,
  RuleList,
} from "@/pages/PasswordResetPage/components/PasswordFormCard";
import { confirmPasswordReset, verifyPasswordResetToken } from "@/shared/api/auth";
import { NaturalShape, StraightShape, WaveShape } from "@/shared/components/BoneShapes";

export const PasswordResetPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState("");
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const hasLetter = /[A-Za-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const isLengthValid = password.length >= 8 && password.length <= 12;
  const isPasswordValid = hasLetter && hasNumber && hasSpecial && isLengthValid;
  const isPasswordMatch = password.length > 0 && password === confirmPassword;

  const canSubmit = useMemo(() => {
    return isTokenValid && isPasswordValid && isPasswordMatch && !isSubmitting;
  }, [isTokenValid, isPasswordValid, isPasswordMatch, isSubmitting]);

  useEffect(() => {
    const tokenParam = searchParams.get("token") ?? "";
    const storedToken =
      typeof window !== "undefined"
        ? (window.sessionStorage.getItem("passwordResetToken") ?? "")
        : "";
    const resolvedToken = tokenParam || storedToken;

    if (!resolvedToken) {
      alert("유효하지 않은 링크입니다.");
      navigate("/login", { replace: true });
      return;
    }

    if (tokenParam) {
      window.sessionStorage.setItem("passwordResetToken", tokenParam);
      window.history.replaceState({}, "", "/password-reset");
    }

    let isActive = true;
    setIsVerifying(true);
    verifyPasswordResetToken(resolvedToken)
      .then((response) => {
        if (!isActive) {
          return;
        }
        if (response.code !== 200) {
          throw new Error("Invalid token");
        }
        setToken(resolvedToken);
        setIsTokenValid(true);
      })
      .catch(() => {
        if (!isActive) {
          return;
        }
        window.sessionStorage.removeItem("passwordResetToken");
        alert("유효하지 않은 링크입니다.");
        navigate("/login", { replace: true });
      })
      .finally(() => {
        if (!isActive) {
          return;
        }
        setIsVerifying(false);
      });

    return () => {
      isActive = false;
    };
  }, [navigate, searchParams]);

  const handleSubmit = async () => {
    if (!canSubmit) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await confirmPasswordReset({
        token,
        newPassword: password,
        confirmPassword,
      });

      if (response.code !== 200) {
        throw new Error("Failed to reset password");
      }

      window.sessionStorage.removeItem("passwordResetToken");
      alert("비밀번호 변경이 완료되었습니다.");
      navigate("/login");
    } catch {
      alert("비밀번호 변경에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Page>
      <LoginHeader />
      <Main>
        <ShapesLayer aria-hidden="true">
          <StraightShape />
          <WaveShape />
          <NaturalShape />
        </ShapesLayer>

        <PasswordFormCard
          title="비밀번호 재설정"
          descriptions={[
            "새로운 비밀번호를 입력해 주세요.",
            "이전에 사용한 적 없는 비밀번호가 안전합니다.",
          ]}
          actionLabel="비밀번호 변경"
          actionLabelSubmitting="변경 중..."
          isSubmitting={isSubmitting}
          canSubmit={canSubmit}
          onSubmit={handleSubmit}
          links={
            <LinkButton type="button" onClick={() => navigate("/login")}>
              로그인으로 돌아가기
            </LinkButton>
          }
        >
          <Field>
            <Label>새 비밀번호</Label>
            <InputWrap>
              <Input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="비밀번호를 입력해 주세요"
                autoComplete="new-password"
                disabled={!isTokenValid || isVerifying}
                aria-invalid={password.length > 0 && !isPasswordValid}
              />
              <InputIcon aria-hidden="true">
                <LuLock />
              </InputIcon>
            </InputWrap>
            <RuleList>
              <RuleItem $active={hasLetter}>영문 포함</RuleItem>
              <RuleItem $active={hasNumber}>숫자 포함</RuleItem>
              <RuleItem $active={isLengthValid}>8~12자</RuleItem>
              <RuleItem $active={hasSpecial}>특수문자 포함</RuleItem>
            </RuleList>
          </Field>

          <Field>
            <Label>새 비밀번호 확인</Label>
            <InputWrap>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="비밀번호를 다시 입력해 주세요"
                autoComplete="new-password"
                disabled={!isTokenValid || isVerifying}
                aria-invalid={confirmPassword.length > 0 && !isPasswordMatch}
              />
              <InputIcon aria-hidden="true" $success={isPasswordMatch}>
                <FaCheck />
              </InputIcon>
            </InputWrap>
            <HelperText $error={confirmPassword.length > 0 && !isPasswordMatch}>
              {confirmPassword.length > 0 && !isPasswordMatch
                ? "비밀번호가 일치하지 않습니다."
                : " "}
            </HelperText>
          </Field>
        </PasswordFormCard>
      </Main>
    </Page>
  );
};

const Page = styled.div`
  min-height: 100vh;
  width: 100%;
  background: ${({ theme }) => theme.colors.primary};
  display: flex;
  flex-direction: column;
`;

const Main = styled.main`
  position: relative;
  width: 100%;
  flex: 1;
  display: flex;
  justify-content: center;
  padding: 10rem 1.5rem 7.5rem;

  @media (max-width: 1024px) {
    padding: 8rem 1.5rem 6rem;
  }

  @media (max-width: 768px) {
    padding: 6.5rem 1rem 4.5rem;
  }
`;

const ShapesLayer = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;

  & ${StraightShape} {
    top: 8%;
    right: 8%;
    opacity: 0.32;
  }

  & ${WaveShape} {
    bottom: 10%;
    left: 6%;
    opacity: 0.3;
  }

  & ${NaturalShape} {
    top: 58%;
    left: 12%;
    margin-left: 0;
    margin-top: 0;
    opacity: 0.2;
  }

  @media (max-width: 1024px) {
    & ${StraightShape} {
      top: 6%;
      right: 5%;
    }

    & ${WaveShape} {
      bottom: 8%;
      left: 4%;
    }

    & ${NaturalShape} {
      top: 62%;
      left: 6%;
    }
  }

  @media (max-width: 768px) {
    & ${NaturalShape} {
      display: none;
    }
  }
`;
