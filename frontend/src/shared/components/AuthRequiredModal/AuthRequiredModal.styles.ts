import { styled } from "styled-components";

export const Content = styled.div`
  background: ${({ theme }) => theme.colors.background};
  border-radius: 12px;
  padding: ${({ theme }) => theme.spacing.xxl};
  max-width: 400px;
  width: 90vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};

  @media (min-width: 768px) {
    width: 400px;
  }
`;

export const IconWrapper = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.gray[800]};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const LockIcon = styled.div`
  width: 32px;
  height: 32px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%239810FA' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='11' width='18' height='11' rx='2' ry='2'/%3E%3Cpath d='M7 11V7a5 5 0 0 1 10 0v4'/%3E%3C/svg%3E");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
`;

export const Title = styled.h2`
  font-size: ${({ theme }) => theme.typography.heading.sm.fontSize};
  font-weight: ${({ theme }) => theme.typography.heading.sm.fontWeight};
  color: ${({ theme }) => theme.colors.text};
  color: white;
  margin: 0;
  text-align: center;
`;

export const Message = styled.p`
  font-size: ${({ theme }) => theme.typography.body.md.regular.fontSize};
  font-weight: ${({ theme }) => theme.typography.body.md.regular.fontWeight};
  color: ${({ theme }) => theme.colors.textLight};
  margin: 0;
  text-align: center;
  line-height: 1.5;
`;

export const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  width: 100%;
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const BaseButton = styled.button`
  width: 100%;
  padding: 0.75rem ${({ theme }) => theme.spacing.lg};
  border-radius: 0.25rem;
  font-size: ${({ theme }) => theme.typography.body.lg.medium.fontSize};
  font-weight: ${({ theme }) => theme.typography.body.lg.medium.fontWeight};
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  border: none;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

export const PrimaryButton = styled(BaseButton)`
  background: ${({ theme }) => theme.colors.brand};
  color: ${({ theme }) => theme.colors.secondary};

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.purple[700]};
  }

  &:active:not(:disabled) {
    background: ${({ theme }) => theme.colors.purple[800]};
  }
`;

export const SecondaryButton = styled(BaseButton)`
  background: ${({ theme }) => theme.colors.gray[100]};
  color: ${({ theme }) => theme.colors.text};

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.gray[200]};
  }

  &:active:not(:disabled) {
    background: ${({ theme }) => theme.colors.gray[300]};
  }
`;
