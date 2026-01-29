import { useEffect, useState, useRef } from "react";
import { IoArrowForward, IoPerson } from "react-icons/io5";
import { MdMyLocation } from "react-icons/md";
import { TbBoxAlignBottomRight } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import { AnalysisComplete } from "./components/AnalysisComplete";
import { AnalysisProgress } from "./components/AnalysisProgress";
import { CameraCaptureControls } from "./components/CameraCaptureControls";
import CameraPreview from "./components/CameraPreview";
import { ModeSelector } from "./components/ModeSelector";
import { PoseValidationFeedback } from "./components/PoseValidationFeedback";
import { ProgressSteps } from "./components/ProgressSteps";
import { ScanningGuideBullet } from "./components/ScanningGuideBullet";
import { ScanningGuideCard } from "./components/ScanningGuideCard";
import { UploadArea } from "./components/UploadArea";

import type { CaptureMode, AnalysisStatus } from "@/shared/types/diagnosis";
import type { PoseValidationResult } from "@/shared/utils/poseValidation";
import type { Results } from "@mediapipe/pose";

import { usePresignedUrl, useS3Upload, useAnalysisRequest } from "@/pages/diagnosis/api";
import { useMediaQuery } from "@/shared/hooks";
import { useDiagnosisStore } from "@/shared/stores/diagnosisStore";
import { dataURLtoBlob, generateFilename, compressImage } from "@/shared/utils/image";
import { validateFullBodyPose } from "@/shared/utils/poseValidation";
import { validateImagePose } from "@/shared/utils/validateImagePose";

// Layout containers
const PageContainer = styled.div`
  min-height: 100vh;
  margin-top: 80px;
  background-color: ${({ theme }) => theme.colors.gray[900]};
  color: ${({ theme }) => theme.colors.secondary};
  display: flex;
  flex-direction: column;

  @media (min-width: 1024px) {
    flex-direction: row;
  }
`;

const LeftSidebar = styled.div`
  display: none;

  @media (min-width: 1024px) {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 650px;
    padding: ${({ theme }) => theme.spacing.xxl};
    background-color: ${({ theme }) => theme.colors.gray[900]};
  }
`;

const SidebarContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const StepLabel = styled.p`
  font-size: ${({ theme }) => theme.typography.body.md.semibold.fontSize};
  font-weight: ${({ theme }) => theme.typography.body.md.semibold.fontWeight};
  color: ${({ theme }) => theme.colors.purple[600]};
  letter-spacing: 2.4px;
  text-transform: uppercase;
  margin: 0;
`;

const Title = styled.h1`
  font-size: 60px;
  font-weight: 700;
  line-height: 1.2;
  color: ${({ theme }) => theme.colors.secondary};
  margin: 0;
`;

const Description = styled.p`
  font-size: 14px;
  font-weight: 300;
  line-height: 22.75px;
  color: ${({ theme }) => theme.colors.gray[300]};
  margin: 0;
`;

// Mobile/Tablet Header
const MobileHeader = styled.div`
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.md};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};

  @media (min-width: 768px) and (max-width: 1023px) {
    padding: ${({ theme }) => theme.spacing.xxl};
    gap: ${({ theme }) => theme.spacing.xl};
  }

  @media (min-width: 1024px) {
    display: none;
  }
`;

const MobileTopSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: center;

  @media (min-width: 768px) and (max-width: 1023px) {
    align-items: flex-start;
  }
`;

const MobileTitleSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};

  @media (min-width: 768px) and (max-width: 1023px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-end;
    width: 100%;
  }
`;

const MobileTitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const MobileTitle = styled.h1`
  font-size: 40px;
  font-weight: 700;
  line-height: 1.2;
  color: ${({ theme }) => theme.colors.secondary};
  margin: 0;

  @media (min-width: 768px) {
    font-size: 48px;
  }
`;

const MobileDescription = styled.p`
  font-size: 14px;
  font-weight: 300;
  line-height: 22.75px;
  color: ${({ theme }) => theme.colors.gray[300]};
  margin: 0;
  text-align: center;

  @media (min-width: 768px) and (max-width: 1023px) {
    text-align: right;
    max-width: 50%;
  }
`;

// Content area
const ContentArea = styled.div`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.md};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};

  @media (min-width: 768px) and (max-width: 1023px) {
    padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.xxl};
    flex-direction: row;
    align-items: flex-start;
    gap: ${({ theme }) => theme.spacing.lg};
  }

  @media (min-width: 1024px) {
    padding: ${({ theme }) => theme.spacing.xxl};
    flex-direction: row;
    gap: ${({ theme }) => theme.spacing.xl};
    align-items: flex-start;
  }
`;

const CaptureSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};

  @media (min-width: 768px) and (max-width: 1023px) {
    flex-shrink: 0;
    width: 361px;
  }

  @media (min-width: 1024px) {
    flex-shrink: 0;
    width: 448px;
  }
`;

const GuideSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  width: 100%;

  @media (min-width: 768px) {
    max-width: none;
  }

  @media (min-width: 1024px) {
    width: 365px;
  }
`;

const GuideSectionHeader = styled.h2`
  font-size: ${({ theme }) => theme.typography.body.md.regular.fontSize};
  font-weight: ${({ theme }) => theme.typography.body.md.regular.fontWeight};
  color: ${({ theme }) => theme.colors.gray[400]};
  text-transform: uppercase;
  letter-spacing: 1.2px;
  margin: 0;
  display: none;

  @media (min-width: 768px) {
    display: block;
  }
`;

const GuideCards = styled.div`
  display: none;

  @media (min-width: 768px) {
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  width: 100%;
  max-width: 28rem;
  margin: 0 auto;

  @media (min-width: 768px) {
    max-width: none;
  }

  @media (min-width: 1024px) {
    max-width: 365px;
    margin: 0;
  }
`;

const Button = styled.button<{ $variant?: "primary" | "secondary" }>`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border-radius: 9999px;
  font-size: ${({ theme }) => theme.typography.body.md.semibold.fontSize};
  font-weight: ${({ theme }) => theme.typography.body.md.semibold.fontWeight};
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};

  ${({ theme, $variant }) =>
    $variant === "primary"
      ? `
    background-color: ${theme.colors.purple[600]};
    color: ${theme.colors.secondary};

    &:hover {
      background-color: ${theme.colors.purple[900]};
    }

    &:focus {
      outline: 2px solid ${theme.colors.purple[600]};
      outline-offset: 2px;
    }

    &:disabled {
      background-color: ${theme.colors.gray[700]};
      color: ${theme.colors.gray[500]};
      cursor: not-allowed;
    }
  `
      : `
    background-color: transparent;
    color: ${theme.colors.gray[300]};
    border: 1px solid ${theme.colors.gray[600]};

    &:hover {
      background-color: ${theme.colors.gray[800]};
      border-color: ${theme.colors.gray[500]};
    }

    &:focus {
      outline: 2px solid ${theme.colors.gray[600]};
      outline-offset: 2px;
    }
  `}
`;

const PhotoCapturePage = () => {
  const navigate = useNavigate();
  const { diagnosisData, setPhotoData, setAnalysisResult } = useDiagnosisStore();
  const isMobile = useMediaQuery("(max-width: 767px)");
  const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 1023px)");

  // State
  const [mode, setMode] = useState<CaptureMode>("camera");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [poseValidation, setPoseValidation] = useState<PoseValidationResult | null>(null);
  const [analysisStatus, setAnalysisStatus] = useState<AnalysisStatus>("idle");
  const [countdown, setCountdown] = useState<number | null>(null);
  const [showFlash, setShowFlash] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const captureRef = useRef<(() => string | null) | null>(null);
  const latestLandmarksRef = useRef<Results | null>(null);

  // API hooks
  const presignedUrlMutation = usePresignedUrl();
  const s3UploadMutation = useS3Upload();
  const analysisRequestMutation = useAnalysisRequest();

  // Redirect if no basic info
  useEffect(() => {
    if (!diagnosisData.basicInfo) {
      navigate("/diagnosis/basic-info", { replace: true });
    }
  }, [diagnosisData.basicInfo, navigate]);

  // Handle camera capture with countdown
  const handleCapture = () => {
    if (!captureRef.current) return;

    let count = 3;
    setCountdown(count);

    const countdownInterval = setInterval(() => {
      count--;
      if (count > 0) {
        setCountdown(count);
      } else {
        clearInterval(countdownInterval);
        setCountdown(null);

        // Flash effect
        setShowFlash(true);
        setTimeout(() => setShowFlash(false), 200);

        // Capture image
        const imageData = captureRef.current?.();
        if (imageData) {
          setSelectedImage(imageData);
          // Validate pose using latest landmarks
          if (latestLandmarksRef.current) {
            const result = validateFullBodyPose(latestLandmarksRef.current);
            setPoseValidation(result);
          }
        }
      }
    }, 1000);
  };

  // Handle image upload and validation
  const handleImageUpload = async (imageData: string) => {
    setSelectedImage(imageData);
    // Validate pose for static image
    const result = await validateImagePose(imageData);
    setPoseValidation(result);
  };

  // Handle retry (reset state)
  const handleRetry = () => {
    setSelectedImage(null);
    setPoseValidation(null);
    if (mode === "camera") {
      setCameraActive(true);
    }
  };

  // Handle mode change
  const handleModeChange = (newMode: CaptureMode) => {
    setMode(newMode);
    setSelectedImage(null);
    setPoseValidation(null);
    setCameraActive(newMode === "camera");
  };

  // Handle analysis flow
  const handleAnalyze = async () => {
    if (!selectedImage || !poseValidation?.isValid || !diagnosisData.basicInfo) {
      return;
    }

    try {
      // Step 1: S3 Upload
      setAnalysisStatus("s3-upload");

      // Compress image before upload
      const compressedImage = await compressImage(selectedImage, 1920, 0.8);
      const imageBlob = dataURLtoBlob(compressedImage);
      const fileName = generateFilename("diagnosis", "jpg");

      // Get presigned URL
      const presignedData = await presignedUrlMutation.mutateAsync({
        fileName,
        fileType: "image/jpeg",
      });

      // Upload to S3
      await s3UploadMutation.mutateAsync({
        uploadUrl: presignedData.uploadUrl,
        imageBlob,
      });

      // Step 2: Analysis Request
      setAnalysisStatus("analysis-request");

      const analysisResponse = await analysisRequestMutation.mutateAsync({
        gender: diagnosisData.basicInfo.gender,
        height: diagnosisData.basicInfo.height,
        weight: diagnosisData.basicInfo.weight,
        styles: diagnosisData.basicInfo.styles,
        imageKey: presignedData.fileKey,
      });

      // Step 3: Processing (in MSW, it's instant, but in real scenario this would poll)
      setAnalysisStatus("processing");

      // Simulate processing delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Step 4: Complete
      setAnalysisStatus("complete");

      // Save to store
      setPhotoData(selectedImage);
      setAnalysisResult({
        analysisId: analysisResponse.analysisId,
        bodyType: "Natural", // This would come from polling getAnalysisResult
        bodyTypeRatio: { natural: 60, wave: 25, straight: 15 },
        measurements: { shoulderWidth: 42, waistWidth: 28, hipWidth: 38 },
        recommendations: ["루즈핏 상의가 잘 어울립니다", "자연스러운 실루엣의 원피스를 추천합니다"],
        processedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Analysis failed:", error);
      alert("분석에 실패했습니다. 다시 시도해주세요.");
      setAnalysisStatus("idle");
    }
  };

  // Handle landmarks update from camera
  const handleLandmarksUpdate = (results: Results | null) => {
    latestLandmarksRef.current = results;
  };

  // Navigate to results
  const handleNavigateToResults = () => {
    navigate("/");
  };

  const handleBack = () => {
    navigate("/diagnosis/basic-info");
  };

  return (
    <PageContainer>
      {/* Desktop Left Sidebar */}
      <LeftSidebar>
        <SidebarContent>
          <StepLabel>STEP 02. PHOTO SCAN</StepLabel>
          <Title>
            이제, 체형을
            <br />
            스캔합니다
          </Title>
          <Description>
            정면 전신 사진을 업로드해주세요.
            <br />
            AI가 관절 위치를 인식하여 골격을 분석합니다.
          </Description>
        </SidebarContent>
        <ProgressSteps currentStep={2} />
      </LeftSidebar>

      {/* Mobile/Tablet Header */}
      <MobileHeader>
        <MobileTopSection>
          <ProgressSteps currentStep={2} />
          <MobileTitleSection>
            <MobileTitleWrapper>
              <StepLabel>STEP 02. PHOTO SCAN</StepLabel>
              <MobileTitle>
                이제, 체형을
                <br />
                측정합니다
              </MobileTitle>
            </MobileTitleWrapper>
            {isTablet && (
              <MobileDescription>
                정면 전신 사진을 업로드해주세요.
                <br />
                AI가 관절 위치를 인식하여 골격을 분석합니다.
              </MobileDescription>
            )}
          </MobileTitleSection>
          {isMobile && (
            <MobileDescription>
              정면 전신 사진을 업로드해주세요.
              <br />
              AI가 관절 위치를 인식하여 골격을 분석합니다.
            </MobileDescription>
          )}
        </MobileTopSection>
      </MobileHeader>

      {/* Main Content Area */}
      <ContentArea>
        <CaptureSection>
          <ModeSelector mode={mode} onModeChange={handleModeChange} />

          {mode === "camera" ? (
            <>
              <CameraPreview
                capturedImage={selectedImage}
                countdown={countdown}
                showFlash={showFlash}
                onCaptureReady={(captureFunc) => {
                  captureRef.current = captureFunc;
                }}
                onCameraActiveChange={(isActive) => {
                  setCameraActive(isActive);
                }}
                onLandmarksUpdate={handleLandmarksUpdate}
              />
              <CameraCaptureControls
                onCapture={handleCapture}
                onRetake={handleRetry}
                hasImage={!!selectedImage}
                isValidPose={poseValidation?.isValid ?? false}
                cameraActive={cameraActive}
              />
            </>
          ) : (
            <UploadArea onImageSelect={handleImageUpload} selectedImage={selectedImage} />
          )}

          <PoseValidationFeedback
            validationResult={poseValidation}
            mode={mode}
            onRetry={handleRetry}
          />
        </CaptureSection>

        <GuideSection>
          {/* Mobile Guide (Bullet List) */}
          <ScanningGuideBullet />

          {/* Tablet/Desktop Guide (Cards) */}
          <GuideSectionHeader>Scanning Guide</GuideSectionHeader>
          <GuideCards>
            <ScanningGuideCard
              icon={<IoPerson />}
              title="Full Body"
              description="머리부터 발끝까지 전신이 나오도록 촬영해주세요"
            />
            <ScanningGuideCard
              icon={<MdMyLocation />}
              title="Tight Fit"
              description="몸의 체형이 드러나는 옷을 입고 촬영해주세요"
            />
            <ScanningGuideCard
              icon={<TbBoxAlignBottomRight />}
              title="A-Pose"
              description="양손은 보고 팔은 벌린 A-포즈 취해주세요"
            />
          </GuideCards>

          {/* Buttons */}
          <ButtonGroup>
            <Button
              $variant="primary"
              onClick={handleAnalyze}
              disabled={!selectedImage || !poseValidation?.isValid}
            >
              분석하기 <IoArrowForward aria-hidden="true" />
            </Button>
            <Button $variant="secondary" onClick={handleBack}>
              뒤로가기
            </Button>
          </ButtonGroup>
        </GuideSection>
      </ContentArea>

      {/* Analysis Progress Modal */}
      <AnalysisProgress
        isOpen={["s3-upload", "analysis-request", "processing"].includes(analysisStatus)}
        currentStep={analysisStatus}
      />

      {/* Analysis Complete Modal */}
      <AnalysisComplete
        isOpen={analysisStatus === "complete"}
        onNavigateToResults={handleNavigateToResults}
      />
    </PageContainer>
  );
};

export default PhotoCapturePage;
