import styled from "styled-components";

export const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: clamp(12px, 6vw, 48px);
  padding-bottom: clamp(80px, 15vh, 120px);
`;

export const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: clamp(10px, 2vw, 15px);
`;

export const Avatar = styled.div`
  width: clamp(40px, 8vw, 50px);
  height: clamp(40px, 8vw, 50px);
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.gray[700]};
  border: 2px solid ${({ theme }) => theme.colors.purple[600]};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

export const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const AvatarPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: ${({ theme }) => theme.colors.gray[400]};
`;

export const Username = styled.div`
  font-size: clamp(14px, 3vw, 17.5px);
  font-weight: 700;
  color: ${({ theme }) => theme.colors.gray[50]};
`;

export const SubmitButtonContainer = styled.div`
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 100;

  @media (min-width: 1024px) {
    bottom: 40px;
    right: 40px;
  }
`;

export const SubmitButton = styled.button<{ $disabled: boolean }>`
  width: 88px;
  min-height: 44px;
  height: 44px;
  background-color: ${({ $disabled }) => ($disabled ? "#A1A1A1" : "#4A83EF")};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 700;
  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
  box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.05);
  transform: scale(1);
  transition: all 0.2s ease;
  -webkit-tap-highlight-color: rgba(74, 131, 239, 0.2);
  touch-action: manipulation;

  &:hover:not(:disabled) {
    background-color: #3a6bc7;
    transform: scale(1.05);
    box-shadow: 0 6px 16px rgba(74, 131, 239, 0.4);
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.6;
  }

  ${({ $disabled }) =>
    $disabled &&
    `
    position: relative;
    &::after {
      content: '';
      display: inline-block;
      width: 12px;
      height: 12px;
      margin-left: 8px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      vertical-align: middle;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `}
`;
