import { useEffect } from "react";
import styled from "styled-components";

import { useWebcam } from "@/shared/hooks";

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
  aspect-ratio: 9 / 16;
  background-color: ${({ theme }) => theme.colors.gray[900]};
  border-radius: 1rem;
  overflow: hidden;
`;

const Video = styled.video`
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

interface CameraPreviewProps {
  onCapture?: (imageData: string) => void;
}

const CameraPreview = ({ onCapture }: CameraPreviewProps) => {
  const { videoRef, isActive, error, startCamera } = useWebcam();

  useEffect(() => {
    startCamera();
  }, [startCamera]);

  return (
    <Container>
      <PreviewWrapper>
        <Video ref={videoRef} autoPlay playsInline muted />

        {!isActive && !error && (
          <LoadingOverlay>카메라를 시작하는 중...</LoadingOverlay>
        )}

        {error && (
          <ErrorMessage>
            <ErrorTitle>카메라 접근 실패</ErrorTitle>
            <ErrorText>{error}</ErrorText>
            <ErrorText>
              브라우저 설정에서 카메라 권한을 허용해주세요.
            </ErrorText>
          </ErrorMessage>
        )}
      </PreviewWrapper>
    </Container>
  );
};

export default CameraPreview;
