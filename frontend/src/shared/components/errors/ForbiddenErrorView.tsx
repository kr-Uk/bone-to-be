import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import type { NavigateFunction } from "react-router-dom";

import { useAuth } from "@/shared/hooks/useAuth";

interface ForbiddenErrorViewProps {
  title?: string;
  message?: string;
  onHomeClick?: () => void;
  showLoginButton?: boolean;
}

function ForbiddenErrorView({
  title = "접근 권한이 없습니다",
  message = "이 리포트를 볼 수 있는 권한이 없거나 비공개 리포트입니다.",
  onHomeClick,
  showLoginButton = true,
}: ForbiddenErrorViewProps) {
  const navigate: NavigateFunction = useNavigate();
  const { isLoggedIn } = useAuth();

  // 미로그인 시 로그인 버튼 표시
  const shouldShowLogin = !isLoggedIn && showLoginButton;

  const handleHomeClick = (): void => {
    if (onHomeClick) {
      onHomeClick();
    } else {
      navigate("/");
    }
  };

  const handleMyReportsClick = (): void => {
    navigate("/profile");
  };

  const handleLoginClick = (): void => {
    navigate("/login");
  };

  return (
    <Container>
      <IconWrapper aria-label="접근 권한 없음">🔒</IconWrapper>
      <Title>{title}</Title>
      <Message>{message}</Message>

      <ButtonGroup>
        <PrimaryButton onClick={handleHomeClick}>홈으로 돌아가기</PrimaryButton>
        <SecondaryButton onClick={handleMyReportsClick}>내 분석 결과 보기</SecondaryButton>
        {shouldShowLogin && (
          <SecondaryButton onClick={handleLoginClick}>로그인하기</SecondaryButton>
        )}
      </ButtonGroup>
    </Container>
  );
}

export default ForbiddenErrorView;

// Styled Components

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: ${({ theme }) => theme.spacing.xl};
  background-color: ${({ theme }) => theme.colors.gray[50]};

  @media (min-width: 768px) {
    min-height: 70vh;
    padding: ${({ theme }) => theme.spacing.xxl};
  }
`;

const IconWrapper = styled.div`
  font-size: 4rem;
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  @media (min-width: 768px) {
    font-size: 5rem;
    margin-bottom: ${({ theme }) => theme.spacing.xl};
  }
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.heading.lg.fontSize};
  font-weight: ${({ theme }) => theme.typography.heading.lg.fontWeight};
  line-height: ${({ theme }) => theme.typography.heading.lg.lineHeight};
  color: ${({ theme }) => theme.colors.gray[900]};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  text-align: center;

  @media (min-width: 768px) {
    font-size: ${({ theme }) => theme.typography.heading["2xl"].fontSize};
  }
`;

const Message = styled.p`
  font-size: ${({ theme }) => theme.typography.body.lg.regular.fontSize};
  font-weight: ${({ theme }) => theme.typography.body.lg.regular.fontWeight};
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.gray[600]};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  max-width: 500px;

  @media (min-width: 768px) {
    font-size: 1.125rem;
    margin-bottom: ${({ theme }) => theme.spacing.xxl};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  width: 100%;
  max-width: 400px;

  @media (min-width: 768px) {
    flex-direction: row;
    gap: ${({ theme }) => theme.spacing.lg};
  }
`;

const BaseButton = styled.button`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
  font-size: ${({ theme }) => theme.typography.body.lg.medium.fontSize};
  font-weight: ${({ theme }) => theme.typography.body.lg.medium.fontWeight};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  border: none;
  white-space: nowrap;

  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.purple[600]};
    outline-offset: 2px;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  @media (min-width: 768px) {
    padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.xl};
  }
`;

const PrimaryButton = styled(BaseButton)`
  background-color: ${({ theme }) => theme.colors.purple[600]};
  color: ${({ theme }) => theme.colors.secondary};

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.purple[700]};
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.purple[800]};
    transform: translateY(0);
  }
`;

const SecondaryButton = styled(BaseButton)`
  background-color: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.gray[900]};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.gray[100]};
    border-color: ${({ theme }) => theme.colors.gray[400]};
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.gray[200]};
    transform: translateY(0);
  }
`;
