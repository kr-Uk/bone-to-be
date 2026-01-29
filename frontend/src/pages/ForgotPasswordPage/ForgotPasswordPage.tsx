import { isAxiosError } from "axios";
import { useMemo, useState } from "react";
import { LuMail } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import LoginHeader from "@/pages/LoginPage/components/LoginHeader";
import { NaturalShape, StraightShape, WaveShape } from "@/shared/components/BoneShapes";
import { usePasswordResetRequest } from "@/shared/hooks/usePasswordResetRequest";

type FormSectionProps = {
  email: string;
  emailTrimmed: string;
  isEmailFormatValid: boolean;
  isSubmitting: boolean;
  onChangeEmail: (value: string) => void;
  onSubmit: () => void;
  onMoveLogin: () => void;
  onMoveSignUp: () => void;
};

const ForgotPasswordHeaderSection = () => (
  <Header>
    <Title>비밀번호 찾기</Title>
    <DescGroup>
      <Desc>가입 시 등록한 이메일 주소를 입력해 주세요</Desc>
      <Desc>계정으로 비밀번호 재설정 링크를 보내드립니다.</Desc>
    </DescGroup>
  </Header>
);

const ForgotPasswordFormSection = ({
  email,
  emailTrimmed,
  isEmailFormatValid,
  isSubmitting,
  onChangeEmail,
  onSubmit,
  onMoveLogin,
  onMoveSignUp,
}: FormSectionProps) => (
  <Form>
    <Field>
      <Label>이메일 주소</Label>

      <InputWrap>
        <Input
          value={email}
          onChange={(event) => onChangeEmail(event.target.value)}
          placeholder="example@bonetobe.com"
          inputMode="email"
          autoComplete="email"
          aria-invalid={emailTrimmed.length > 0 && !isEmailFormatValid}
        />
        <IconButton type="button" aria-label="email icon" tabIndex={-1}>
          <MailIcon
            $active={emailTrimmed.length > 0}
            $invalid={emailTrimmed.length > 0 && !isEmailFormatValid}
          />
        </IconButton>
      </InputWrap>

      {emailTrimmed.length > 0 && !isEmailFormatValid && (
        <ErrorText>이메일 형식을 확인해 주세요.</ErrorText>
      )}
    </Field>

    <ButtonRow>
      <PrimaryButton
        type="button"
        onClick={onSubmit}
        disabled={!isEmailFormatValid || isSubmitting}
      >
        <PrimaryButtonText>{isSubmitting ? "전송 중..." : "링크 전송"}</PrimaryButtonText>
      </PrimaryButton>
    </ButtonRow>

    <Links>
      <LinkButton type="button" onClick={onMoveLogin}>
        로그인으로 돌아가기
      </LinkButton>
      <Divider />
      <LinkButton type="button" onClick={onMoveSignUp}>
        회원가입
      </LinkButton>
    </Links>
  </Form>
);

const ForgotPasswordBackgroundSection = () => (
  <ShapesLayer aria-hidden="true">
    <StraightShape />
    <WaveShape />
    <NaturalShape />
  </ShapesLayer>
);

export const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const passwordResetMutation = usePasswordResetRequest();
  const [email, setEmail] = useState("");

  const emailTrimmed = useMemo(() => email.trim(), [email]);
  const isEmailFormatValid = useMemo(() => {
    if (emailTrimmed.length === 0) {
      return false;
    }
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(emailTrimmed);
  }, [emailTrimmed]);

  const isSubmitting = passwordResetMutation.isPending;
  const canSubmit = isEmailFormatValid && !isSubmitting;

  const handleSendLink = async () => {
    if (!canSubmit) {
      return;
    }

    try {
      await passwordResetMutation.mutateAsync({ email: emailTrimmed });
      alert("비밀번호 재설정 링크를 전송했습니다.");
      navigate("/login");
    } catch (error) {
      if (isAxiosError(error)) {
        const status = error.response?.status;
        if (status === 404) {
          alert("전송에 실패했습니다.");
          return;
        }
      }
      alert("전송에 실패했습니다.");
    }
  };

  return (
    <Page>
      <LoginHeader />
      <Main>
        <ForgotPasswordBackgroundSection />
        <Card>
          <ForgotPasswordHeaderSection />
          <ForgotPasswordFormSection
            email={email}
            emailTrimmed={emailTrimmed}
            isEmailFormatValid={isEmailFormatValid}
            isSubmitting={isSubmitting}
            onChangeEmail={setEmail}
            onSubmit={handleSendLink}
            onMoveLogin={() => navigate("/login")}
            onMoveSignUp={() => navigate("/login?mode=signup")}
          />
        </Card>
      </Main>
    </Page>
  );
};

const Page = styled.div`
  min-height: 100vh;
  width: 100%;
  background: ${({ theme }) => theme.colors.gray[900]};
  display: flex;
  flex-direction: column;
`;

const Main = styled.main`
  position: relative;
  width: 100%;
  flex: 1;
  display: flex;
  justify-content: center;
  padding: 6.5rem 1.5rem;

  @media (max-width: 1024px) {
    padding: 10rem 1.5rem;
  }

  @media (max-width: 768px) {
    padding: 7.5rem 1rem;
  }
`;

const ShapesLayer = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;

  & ${StraightShape} {
    top: 6%;
    right: 6%;
  }

  & ${WaveShape} {
    bottom: 8%;
    left: 6%;
  }

  & ${NaturalShape} {
    top: 55%;
    right: 12%;
    left: auto;
    margin-left: 0;
    margin-top: 0;
    opacity: 0.28;
  }

  @media (max-width: 1024px) {
    & ${StraightShape} {
      top: 5%;
      right: 4%;
    }

    & ${WaveShape} {
      bottom: 6%;
      left: 4%;
    }

    & ${NaturalShape} {
      top: 60%;
      right: 6%;
    }
  }

  @media (max-width: 768px) {
    & ${StraightShape} {
      top: 4%;
      right: 3%;
    }

    & ${WaveShape} {
      bottom: 5%;
      left: 3%;
    }

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
  border-radius: 0.5rem;
  box-shadow:
    0 1.5625rem 3.125rem -0.75rem rgba(0, 0, 0, 0.5),
    0 0 1.5rem rgba(0, 0, 0, 0.6);
  padding: 3rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  overflow: hidden;
  z-index: 1;

  @media (max-width: 1024px) {
    max-width: 32.5rem;
    padding: 2.75rem;
  }

  @media (max-width: 768px) {
    max-width: 100%;
    padding: 2rem 1.25rem;
    gap: 1.75rem;
  }
`;

const Header = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 0.5rem;
`;

const Title = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.colors.gray[50]};
  font-family:
    "Pretendard",
    system-ui,
    -apple-system,
    Segoe UI,
    Roboto,
    sans-serif;
  font-size: 1.875rem;
  font-weight: 700;
  line-height: 2.25rem;
  text-align: center;
  white-space: nowrap;

  @media (max-width: 768px) {
    font-size: 1.625rem;
    line-height: 2rem;
  }
`;

const DescGroup = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Desc = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.gray[500]};
  font-family:
    "Pretendard",
    system-ui,
    -apple-system,
    Segoe UI,
    Roboto,
    sans-serif;
  font-size: 0.875rem;
  font-weight: 300;
  line-height: 1.425rem;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 0.8125rem;
    line-height: 1.25rem;
  }
`;

const Form = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Field = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
`;

const Label = styled.span`
  color: ${({ theme }) => theme.colors.gray[500]};
  font-family:
    "Pretendard",
    system-ui,
    -apple-system,
    Segoe UI,
    Roboto,
    sans-serif;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.0375rem;
  line-height: 1rem;
`;

const InputWrap = styled.div`
  position: relative;
  width: 100%;
`;

const Input = styled.input`
  width: 100%;
  height: 3.375rem;
  padding: 0 3.25rem 0 0.875rem;
  border-radius: 0.25rem;
  border: 1px solid ${({ theme }) => theme.colors.gray[700]};
  background: ${({ theme }) => theme.colors.gray[900]};
  color: ${({ theme }) => theme.colors.gray[50]};
  font-family:
    "Pretendard",
    system-ui,
    -apple-system,
    Segoe UI,
    Roboto,
    sans-serif;
  font-size: 0.875rem;
  outline: none;

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray[500]};
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.gray[500]};
  }

  &[aria-invalid="true"] {
    border-color: #ef4444;
  }

  @media (max-width: 768px) {
    height: 3.25rem;
    padding: 0 3rem 0 0.75rem;
  }
`;

const IconButton = styled.button`
  all: unset;
  cursor: default;
  position: absolute;
  right: 0;
  top: 0;
  height: 3.375rem;
  display: inline-flex;
  align-items: center;
  padding: 0 1rem 0 0;

  @media (max-width: 768px) {
    height: 3.25rem;
    padding-right: 0.875rem;
  }
`;

const MailIcon = styled(LuMail)<{ $active: boolean; $invalid: boolean }>`
  width: 1.25rem;
  height: 1.25rem;
  color: ${({ $invalid, $active }) => {
    if ($invalid) return "#ef4444";
    if ($active) return "#a3a3a3";
    return "#737373";
  }};
  pointer-events: none;

  @media (max-width: 768px) {
    width: 1.125rem;
    height: 1.125rem;
  }
`;

const ErrorText = styled.p`
  margin: 0.25rem 0 0;
  color: #ef4444;
  font-family:
    "Pretendard",
    system-ui,
    -apple-system,
    Segoe UI,
    Roboto,
    sans-serif;
  font-size: 0.75rem;
  line-height: 1rem;
`;

const ButtonRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  padding-top: 1rem;

  @media (max-width: 768px) {
    padding-top: 0.75rem;
  }
`;

const PrimaryButton = styled.button`
  width: 100%;
  height: 3.375rem;
  border: 0;
  border-radius: 0.25rem;
  background: ${({ theme }) => theme.colors.brand};
  box-shadow: 0 0 1.25rem rgba(124, 58, 237, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.55;
    box-shadow: none;
  }

  @media (max-width: 768px) {
    height: 3.25rem;
  }
`;

const PrimaryButtonText = styled.span`
  color: ${({ theme }) => theme.colors.gray[50]};
  font-family:
    "Pretendard",
    system-ui,
    -apple-system,
    Segoe UI,
    Roboto,
    sans-serif;
  font-size: 0.875rem;
  font-weight: 700;
  letter-spacing: 0.021875rem;
  line-height: 1.25rem;
`;

const Links = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;

const LinkButton = styled.button`
  all: unset;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.gray[500]};
  font-family:
    "Pretendard",
    system-ui,
    -apple-system,
    Segoe UI,
    Roboto,
    sans-serif;
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1rem;
  white-space: nowrap;

  &:hover {
    color: ${({ theme }) => theme.colors.gray[400]};
  }
`;

const Divider = styled.div`
  width: 1px;
  height: 0.75rem;
  background: ${({ theme }) => theme.colors.gray[700]};
`;
