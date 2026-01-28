import styled from "styled-components";

export const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-bottom: clamp(80px, 15vh, 120px);
  padding: 1.25rem;

  @media (min-width: 768px) {
    gap: 3rem;
  }
`;

export const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  background-color: ${({ theme }) => theme.colors.gray[800]};
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  flex-shrink: 0; /* 고정 높이 유지 */
  border-radius: inherit;
  padding: 1.25rem;
`;

export const Avatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.gray[700]};
  border: 1px solid ${({ theme }) => theme.colors.purple[600]};
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
  font-size: 1rem;
  line-height: 25px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.gray[50]};
`;

export const SubmitButtonContainer = styled.div``;

export const SubmitButton = styled.button<{ $disabled: boolean }>`
  margin: 0 0 0 auto;
  background-color: ${({ $disabled, theme }) => ($disabled ? "#A1A1A1" : theme.colors.purple[600])};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.75rem 1.25rem;
  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
  box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.05);
  transform: scale(1);
  transition: all 0.2s ease;
  -webkit-tap-highlight-color: rgba(74, 131, 239, 0.2);
  touch-action: manipulation;

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.6;
  }
`;
