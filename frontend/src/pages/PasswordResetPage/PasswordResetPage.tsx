import { useEffect, useMemo, useState } from "react";
import { FaCheck } from "react-icons/fa6";
import { LuLock } from "react-icons/lu";
import { useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";

import LoginHeader from "@/pages/LoginPage/components/LoginHeader";
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

        <Card>
          <Header>
            <Title>비밀번호 재설정</Title>
            <DescGroup>
              <Desc>새로운 비밀번호를 입력해 주세요.</Desc>
              <Desc>이전에 사용한 적 없는 비밀번호가 안전합니다.</Desc>
            </DescGroup>
          </Header>

          <Form>
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

            <ActionRow>
              <PrimaryButton type="button" onClick={handleSubmit} disabled={!canSubmit}>
                {isSubmitting ? "변경 중..." : "비밀번호 변경"}
              </PrimaryButton>
            </ActionRow>

            <Links>
              <LinkButton type="button" onClick={() => navigate("/login")}>
                로그인으로 돌아가기
              </LinkButton>
            </Links>
          </Form>
        </Card>
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

const Card = styled.section`
  position: relative;
  width: 100%;
  max-width: 32rem;
  background: ${({ theme }) => theme.colors.gray[900]};
  border: 1px solid ${({ theme }) => theme.colors.gray[600]};
  border-radius: 0.75rem;
  box-shadow:
    0 1.75rem 3.5rem -1rem rgba(0, 0, 0, 0.6),
    0 0 1.5rem rgba(0, 0, 0, 0.6);
  padding: 3rem;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  z-index: 1;

  @media (max-width: 1024px) {
    padding: 2.75rem;
  }

  @media (max-width: 768px) {
    padding: 2.25rem 1.5rem;
    gap: 2rem;
  }
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: center;
  text-align: center;
`;

const Title = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.colors.gray[50]};
  font-size: 1.875rem;
  font-weight: 700;
  line-height: 2.25rem;
`;

const DescGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
`;

const Desc = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.gray[500]};
  font-size: 0.875rem;
  font-weight: 300;
  line-height: 1.5rem;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.span`
  color: ${({ theme }) => theme.colors.gray[500]};
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.04rem;
`;

const InputWrap = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  height: 3.25rem;
  padding: 0 2.75rem 0 0.9rem;
  border-radius: 0.35rem;
  border: 1px solid ${({ theme }) => theme.colors.gray[700]};
  background: ${({ theme }) => theme.colors.gray[900]};
  color: ${({ theme }) => theme.colors.gray[50]};
  font-size: 0.9rem;

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray[500]};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.gray[500]};
  }

  &:disabled {
    opacity: 0.5;
  }
`;

const InputIcon = styled.span<{ $success?: boolean }>`
  position: absolute;
  top: 50%;
  right: 0.9rem;
  transform: translateY(-50%);
  color: ${({ theme, $success }) => ($success ? "#22c55e" : theme.colors.gray[400])};
  pointer-events: none;
  display: inline-flex;
`;

const RuleList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 0.75rem;
  margin-top: 0.25rem;
`;

const RuleItem = styled.span<{ $active: boolean }>`
  font-size: 0.75rem;
  color: ${({ theme, $active }) => ($active ? theme.colors.brand : theme.colors.gray[500])};
`;

const HelperText = styled.p<{ $error?: boolean }>`
  min-height: 1rem;
  margin: 0.25rem 0 0;
  font-size: 0.75rem;
  color: ${({ theme, $error }) => ($error ? "#ef4444" : theme.colors.gray[500])};
`;

const ActionRow = styled.div`
  display: flex;
`;

const PrimaryButton = styled.button`
  width: 100%;
  height: 3.25rem;
  border-radius: 0.35rem;
  border: none;
  background: ${({ theme }) => theme.colors.brand};
  color: ${({ theme }) => theme.colors.gray[50]};
  cursor: pointer;
  font-weight: 700;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.55;
  }
`;

const Links = styled.div`
  display: flex;
  justify-content: center;
`;

const LinkButton = styled.button`
  all: unset;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.gray[500]};
  font-size: 0.75rem;

  &:hover {
    color: ${({ theme }) => theme.colors.gray[400]};
  }
`;
