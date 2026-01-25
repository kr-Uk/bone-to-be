import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";


import DiagnosisExplainSection from "../diagnosis/components/DiagnosisExplainSection";

// import { MobileHeaderTop } from "../diagnosis/components/MobileHeader";
import CameraPreview from "./components/CameraPreview";
import ImageUpload from "./components/ImageUpload";

import { useMediaQuery, useWebcam } from "@/shared/hooks";
import { useDiagnosisStore } from "@/shared/stores/diagnosisStore";

const Container = styled.div`
  min-height: calc(100vh - 5rem);
  display: flex;
  flex-direction: column; // Default to vertical (Mobile/Tablet)

  @media (min-width: 1024px) {
    flex-direction: row; // Horizontal for Desktop
  }
`;



const ContentContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  margin: 0 auto;
  gap: ${({ theme }) => theme.spacing.xl};

  @media (min-width: 1024px) {
    width: 50%;
    max-width: none;
    padding: ${({ theme }) => theme.spacing.xxl};
  }

  & > * {
    max-width: 28rem;
    width: 100%;
    margin-left: auto;
    margin-right: auto;
  }
`;

const ModeToggleWrapper = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.xs};
  background-color: ${({ theme }) => theme.colors.gray[100]};
  border-radius: 9999px;
`;

const ModeButton = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: 9999px;
  background-color: ${({ theme, $active }) => ($active ? theme.colors.primary : "transparent")};
  color: ${({ theme, $active }) => ($active ? theme.colors.secondary : theme.colors.gray[600])};
  font-size: ${({ theme }) => theme.typography.body.md.medium.fontSize};
  font-weight: ${({ theme }) => theme.typography.body.md.medium.fontWeight};
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme, $active }) =>
      $active ? theme.colors.primary : theme.colors.gray[200]};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  width: 100%;
`;

const ActionButton = styled.button<{ $variant?: "primary" | "secondary" }>`
  flex: 1;
  background-color: ${({ theme, $variant }) =>
    $variant === "secondary" ? theme.colors.gray[200] : theme.colors.primary};
  color: ${({ theme, $variant }) =>
    $variant === "secondary" ? theme.colors.gray[700] : theme.colors.secondary};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: 9999px;
  font-weight: ${({ theme }) => theme.typography.body.lg.semibold.fontWeight};
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};

  &:hover {
    background-color: ${({ theme, $variant }) =>
      $variant === "secondary" ? theme.colors.gray[300] : theme.colors.gray[800]};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.gray[300]};
    color: ${({ theme }) => theme.colors.gray[500]};
    cursor: not-allowed;
  }
`;

type CaptureMode = "camera" | "upload";

const PhotoCapturePage = () => {
  const navigate = useNavigate();
  const { diagnosisData, setPhotoData } = useDiagnosisStore();
  const isMobile = useMediaQuery("(max-width: 767px)");
  const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 1023px)");
  const [mode, setMode] = useState<CaptureMode>("camera");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [showFlash, setShowFlash] = useState(false);

  const { videoRef, isActive, error, startCamera, captureImage, stopCamera } = useWebcam();

  // BasicInfo 없으면 첫 페이지로 리다이렉트
  useEffect(() => {
    if (!diagnosisData.basicInfo) {
      navigate("/diagnosis/basic-info", { replace: true });
    }
  }, [diagnosisData.basicInfo, navigate]);

  useEffect(() => {
    if (mode === "camera" && !capturedImage) {
      startCamera();
    } else {
      stopCamera();
    }
  }, [mode, capturedImage, startCamera, stopCamera]);

  const handleCapture = () => {
    if (mode === "camera") {
      const imageData = captureImage();
      if (imageData) {
        // Flash effect
        setShowFlash(true);
        setTimeout(() => setShowFlash(false), 300);

        // Vibration feedback (mobile)
        if (navigator.vibrate) {
          navigator.vibrate(50);
        }

        setCapturedImage(imageData);
      }
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
  };

  const handleConfirm = () => {
    if (capturedImage) {
      setPhotoData(capturedImage);

      // 콘솔에서 전체 데이터 확인
      console.log("Complete diagnosis data:", {
        basicInfo: diagnosisData.basicInfo,
        photo: capturedImage,
      });

      // TODO: 서버 전송
      alert("이미지가 저장되었습니다!");
      // navigate("/diagnosis/analysis");
    }
  };

  const handleImageSelect = (imageData: string) => {
    setCapturedImage(imageData);
  };

  const handleModeChange = (newMode: CaptureMode) => {
    setMode(newMode);
    setCapturedImage(null); // 모드 변경 시 캡처된 이미지 초기화
  };

  return (
    <Container>
      <DiagnosisExplainSection
        currentStep={2}
        stepLabel="STEP 02. PHOTO SCAN"
        title={
          <>
            Capture your
            <br />
            bone structure
            <br />
            photo.
          </>
        }
        description={
          <>
            전신 사진을 촬영하거나 업로드해주세요.
            <br />
            정면을 바라보고 팔을 자연스럽게 내린 자세가 좋습니다.
          </>
        }
        variant={isMobile ? "mobile" : isTablet ? "tablet" : "desktop"}
      />

      <ContentContainer>

        <ModeToggleWrapper>
          <ModeButton $active={mode === "camera"} onClick={() => handleModeChange("camera")}>
            📷 웹캠 촬영
          </ModeButton>
          <ModeButton $active={mode === "upload"} onClick={() => handleModeChange("upload")}>
            📁 이미지 업로드
          </ModeButton>
        </ModeToggleWrapper>

        {mode === "camera" ? (
          <CameraPreview
            capturedImage={capturedImage}
            videoRef={videoRef}
            isActive={isActive}
            error={error}
            showFlash={showFlash}
          />
        ) : (
          <ImageUpload onImageSelect={handleImageSelect} />
        )}

        {capturedImage ? (
          <ButtonGroup>
            <ActionButton $variant="secondary" onClick={handleRetake}>
              ↺ 다시 {mode === "camera" ? "촬영" : "선택"}
            </ActionButton>
            <ActionButton onClick={handleConfirm}>
              확인
              <span>→</span>
            </ActionButton>
          </ButtonGroup>
        ) : (
          <ActionButton
            onClick={handleCapture}
            disabled={mode === "upload" || (mode === "camera" && !isActive)}
          >
            {mode === "camera" ? "📷 촬영하기" : "이미지를 업로드해주세요"}
          </ActionButton>
        )}
      </ContentContainer>
    </Container>
  );
};

export default PhotoCapturePage;
