import { useEffect, useRef } from "react";
import styled, { keyframes } from "styled-components";

import { FullBodyGuideline } from "./FullBodyGuideline";

import type { Results } from "@mediapipe/pose";

import { usePoseDetection } from "@/shared/hooks/usePoseDetection";

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
  aspect-ratio: 4 / 3;
  background-color: ${({ theme }) => theme.colors.gray[900]};
  border-radius: 1rem;
  overflow: hidden;
`;

const Video = styled.video`
  display: none;
`;

const CapturedImage = styled.img<{ $show: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  opacity: ${({ $show }) => ($show ? 1 : 0)};
  pointer-events: ${({ $show }) => ($show ? "auto" : "none")};
  z-index: ${({ $show }) => ($show ? 2 : 0)};
`;

const LandmarkCanvas = styled.canvas`
  width: 100%;
  height: 100%;
  pointer-events: none;
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

const countdownAnimation = keyframes`
  0% { transform: scale(0.5); opacity: 0; }
  50% { transform: scale(1.2); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
`;

const CountdownOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 10;
  pointer-events: none;
`;

const CountdownNumber = styled.div`
  font-size: 8rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.secondary};
  animation: ${countdownAnimation} 0.3s ease-out;
  text-shadow: 0 0 20px rgba(0, 0, 0, 0.8);
`;

interface CameraPreviewProps {
  capturedImage: string | null;
  showFlash: boolean;
  countdown?: number | null;
  onCaptureReady?: (captureFunc: () => string | null) => void;
  onCameraActiveChange?: (isActive: boolean) => void;
  onLandmarksUpdate?: (landmarks: Results | null) => void;
}

const CameraPreview = ({
  capturedImage,
  showFlash,
  countdown,
  onCaptureReady,
  onCameraActiveChange,
  onLandmarksUpdate,
}: CameraPreviewProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewWrapperRef = useRef<HTMLDivElement>(null);

  // 새로운 hook: 카메라 시작, 프레임 캡처, 랜드마크 그리기 모두 처리
  const { cameraActive, latestLandmarks } = usePoseDetection(
    videoRef,
    canvasRef,
    previewWrapperRef,
  );

  // 카메라 활성화 상태를 부모에게 전달
  useEffect(() => {
    onCameraActiveChange?.(cameraActive);
  }, [cameraActive, onCameraActiveChange]);

  // Landmarks 업데이트를 부모에게 전달
  useEffect(() => {
    onLandmarksUpdate?.(latestLandmarks);
  }, [latestLandmarks, onLandmarksUpdate]);

  // 캡처 함수를 부모 컴포넌트에 전달
  useEffect(() => {
    if (cameraActive && canvasRef.current && onCaptureReady) {
      const captureFunc = () => {
        if (!canvasRef.current) return null;
        return canvasRef.current.toDataURL("image/jpeg", 0.95);
      };
      onCaptureReady(captureFunc);
    }
  }, [cameraActive, onCaptureReady]);

  return (
    <Container>
      <PreviewWrapper ref={previewWrapperRef}>
        {/* 비디오는 숨겨져 있음 (hook이 canvas에 그림) */}
        <Video ref={videoRef} autoPlay playsInline muted />
        {/* 캔버스에 비디오 + 랜드마크가 그려짐 (항상 렌더링) */}
        <LandmarkCanvas ref={canvasRef} />

        {/* 전신 촬영 가이드라인 (촬영 전에만 표시) */}
        <FullBodyGuideline show={!capturedImage && cameraActive} canvasRef={canvasRef} />

        {/* 캡처된 이미지 오버레이 (있을 때만 보임) */}
        {capturedImage && (
          <CapturedImage $show={!!capturedImage} src={capturedImage} alt="Captured" />
        )}

        {!capturedImage && !cameraActive && (
          <LoadingOverlay>카메라를 시작하는 중...</LoadingOverlay>
        )}

        {/* 카운트다운 오버레이 */}
        {countdown && countdown > 0 && (
          <CountdownOverlay>
            <CountdownNumber key={countdown}>{countdown}</CountdownNumber>
          </CountdownOverlay>
        )}

        {showFlash && <FlashOverlay />}
      </PreviewWrapper>
    </Container>
  );
};

export default CameraPreview;
