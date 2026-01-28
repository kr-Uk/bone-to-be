import styled from "styled-components";

export const UploadContainer = styled.div<{ $isDragOver: boolean }>`
  position: relative;
  width: 100%;
  height: 100%;
  border: ${({ $isDragOver }) => ($isDragOver ? "3px" : "2px")} dashed
    ${({ theme, $isDragOver }) => ($isDragOver ? theme.colors.purple[600] : theme.colors.gray[600])};
  border-radius: 8px;
  background-color: ${({ $isDragOver }) =>
    $isDragOver ? "rgba(152, 16, 250, 0.15)" : "rgba(152, 16, 250, 0.05)"};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
  cursor: pointer;
  transform: ${({ $isDragOver }) => ($isDragOver ? "scale(1.02)" : "scale(1)")};
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  /* min-height 제거 - 부모의 aspect-ratio에 의존 */
  padding: 24px;

  @media (min-width: 768px) {
    padding: 48px;
  }

  @media (min-width: 1024px) {
    padding: 48px;
  }

  &:hover {
    background-color: rgba(152, 16, 250, 0.1);
    border-color: ${({ theme }) => theme.colors.purple[600]};
  }
`;

export const UploadIconWrapper = styled.div`
  width: 105px;
  height: 105px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.purple[900]};
  display: flex;
  align-items: center;
  justify-content: center;

  @media (min-width: 768px) {
    width: 105px;
    height: 105px;
  }
`;

export const UploadIcon = styled.svg`
  width: 42px;
  height: 42px;
  color: white;

  @media (min-width: 768px) {
    width: 48px;
    height: 48px;
  }
`;

export const UploadTextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

export const UploadTitle = styled.p`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.gray[50]};
  margin: 0;

  @media (min-width: 768px) {
    font-size: 16px;
  }
`;

export const UploadSubtitle = styled.p`
  font-size: 1rem;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.gray[500]};
  margin: 0;

  @media (min-width: 768px) {
    font-size: 14px;
  }
`;

export const SelectButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: ${({ theme }) => theme.colors.gray[200]};
  color: black;
  border: none;
  border-radius: 9999px;
  font-size: 1.125rem;
  font-weight: 600;
  cursor: pointer;
  transform: scale(1);
  transition: all 0.2s ease;
  -webkit-tap-highlight-color: rgba(152, 16, 250, 0.2);
  touch-action: manipulation;

  &:hover {
    background-color: ${({ theme }) => theme.colors.purple[900]};
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(152, 16, 250, 0.3);
  }

  &:active {
    transform: scale(0.98);
  }

  @media (min-width: 768px) {
    height: 51px;
    padding: 15px 32px;
    font-size: 16px;
  }
`;

export const HiddenFileInput = styled.input`
  display: none;
`;

export const PreviewContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 8px;
  overflow: hidden;

  /* min-height 제거 - 부모의 aspect-ratio에 의존 */
`;

export const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  animation: fadeIn 0.3s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

export const RemoveButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  min-width: 44px;
  min-height: 44px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.7);
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: scale(1);
  transition: all 0.2s ease;
  -webkit-tap-highlight-color: rgba(255, 59, 48, 0.2);
  touch-action: manipulation;

  &:hover {
    background-color: rgba(255, 59, 48, 0.9);
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
`;

export const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.colors.purple[600]};
  font-size: 12px;
  margin-top: 8px;
  text-align: center;

  @media (min-width: 768px) {
    font-size: 14px;
  }
`;

export const ImageSkeleton = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.gray[700]} 25%,
    ${({ theme }) => theme.colors.gray[600]} 50%,
    ${({ theme }) => theme.colors.gray[700]} 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;

  @keyframes shimmer {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;
