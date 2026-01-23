import styled, { keyframes } from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const PreviewWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 400px;
  /* aspect-ratio: 9 / 16; */
  aspect-ratio: 3 / 4;
  background-color: ${({ theme }) => theme.colors.gray[900]};
  border-radius: 1rem;
  overflow: hidden;
`;

const Video = styled.video<{ $hidden?: boolean }>`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: ${({ $hidden }) => ($hidden ? "none" : "block")};
`;

const CapturedImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ErrorMessage = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  color: ${({ theme }) => theme.colors.secondary};
`;

const ErrorTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.body.lg.semibold.fontSize};
  font-weight: ${({ theme }) => theme.typography.body.lg.semibold.fontWeight};
`;

const ErrorText = styled.p`
  font-size: ${({ theme }) => theme.typography.body.sm.regular.fontSize};
  color: ${({ theme }) => theme.colors.gray[400]};
`;

const LoadingOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.gray[900]};
  color: ${({ theme }) => theme.colors.secondary};
  font-size: ${({ theme }) => theme.typography.body.md.regular.fontSize};
`;

const flashAnimation = keyframes`
  0% { opacity: 0; }
  50% { opacity: 1; }
  100% { opacity: 0; }
`;

const FlashOverlay = styled.div`
  position: absolute;
  inset: 0;
  background-color: ${({ theme }) => theme.colors.secondary};
  animation: ${flashAnimation} 0.3s ease-out;
  pointer-events: none;
`;

interface CameraPreviewProps {
  capturedImage: string | null;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isActive: boolean;
  error: string | null;
  showFlash: boolean;
}

const CameraPreview = ({
  capturedImage,
  videoRef,
  isActive,
  error,
  showFlash,
}: CameraPreviewProps) => {
  return (
    <Container>
      <PreviewWrapper>
        {capturedImage ? (
          <CapturedImage src={capturedImage} alt="Captured" />
        ) : (
          <Video ref={videoRef} autoPlay playsInline muted />
        )}

        {!capturedImage && !isActive && !error && (
          <LoadingOverlay>카메라를 시작하는 중...</LoadingOverlay>
        )}

        {error && (
          <ErrorMessage>
            <ErrorTitle>카메라 접근 실패</ErrorTitle>
            <ErrorText>{error}</ErrorText>
            <ErrorText>브라우저 설정에서 카메라 권한을 허용해주세요.</ErrorText>
          </ErrorMessage>
        )}

        {showFlash && <FlashOverlay />}
      </PreviewWrapper>
    </Container>
  );
};

export default CameraPreview;
