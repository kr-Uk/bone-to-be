import { Camera } from "@mediapipe/camera_utils";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import { Pose, POSE_CONNECTIONS, type Results, type Options as PoseOptions } from "@mediapipe/pose";
import { useCallback, useEffect, useRef, useState, type RefObject } from "react";

import type { OptimalDimensions } from "@/shared/utils";

const MAX_CANVAS_WIDTH = 400;

interface UsePoseDetectionOptions {
  videoRef: RefObject<HTMLVideoElement | null>;
  displayCanvasRef: RefObject<HTMLCanvasElement | null>; // 시각화용 (사용자에게 표시)
  captureCanvasRef: RefObject<HTMLCanvasElement | null>; // 캡처용 (S3 업로드)
}

export const usePoseDetection = ({
  videoRef,
  displayCanvasRef,
  captureCanvasRef,
}: UsePoseDetectionOptions) => {
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [latestLandmarks, setLatestLandmarks] = useState<Results | null>(null);
  const [canvasDimensions, setCanvasDimensions] = useState<OptimalDimensions | null>(null);
  const poseRef = useRef<Pose | null>(null);
  const cameraRef = useRef<Camera | null>(null);

  // 환경변수로 디버그 모드 확인
  const isDebugMode = import.meta.env.VITE_DEBUG_LANDMARKS === "true";

  // Calculate optimal dimensions from video element
  const calculateDimensionsFromVideo = useCallback(() => {
    if (!videoRef.current) {
      return null;
    }

    const video = videoRef.current;

    // Wait for video dimensions to be available
    if (!video.videoWidth || !video.videoHeight) {
      return null;
    }

    const nativeWidth = video.videoWidth;
    const nativeHeight = video.videoHeight;

    const aspectRatio = nativeWidth / nativeHeight;
    const width = MAX_CANVAS_WIDTH;
    const height = Math.round(width / aspectRatio);

    return {
      width,
      height,
      aspectRatio,
      nativeWidth,
      nativeHeight,
    };
  }, [videoRef]);

  // Initialize MediaPipe Camera and detect dimensions
  useEffect(() => {
    if (!videoRef.current || !displayCanvasRef.current || !captureCanvasRef.current) return;

    const video = videoRef.current;
    const displayCanvas = displayCanvasRef.current;
    const captureCanvas = captureCanvasRef.current;

    // 1. Pose 인스턴스 설정
    const pose = new Pose({
      locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
    });

    const poseOptions: PoseOptions = {
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    };

    pose.setOptions(poseOptions);
    pose.onResults(onResults);
    poseRef.current = pose;

    // 2. Initialize camera with high resolution constraints
    const camera = new Camera(video, {
      onFrame: async () => {
        if (videoRef.current && poseRef.current) {
          await poseRef.current.send({ image: videoRef.current });
        }
      },
      width: 1920,
      height: 1080,
    });

    // 3. Listen for video metadata to get actual resolution
    const handleLoadedMetadata = () => {
      const dimensions = calculateDimensionsFromVideo();
      if (dimensions) {
        setCanvasDimensions(dimensions);

        // Update both canvas sizes based on actual video resolution
        displayCanvas.width = dimensions.width;
        displayCanvas.height = dimensions.height;
        captureCanvas.width = dimensions.width;
        captureCanvas.height = dimensions.height;
      } else {
        // Set fallback dimensions
        const fallback = {
          width: 400,
          height: 300,
          aspectRatio: 4 / 3,
          nativeWidth: 640,
          nativeHeight: 480,
        };
        setCanvasDimensions(fallback);
        displayCanvas.width = fallback.width;
        displayCanvas.height = fallback.height;
        captureCanvas.width = fallback.width;
        captureCanvas.height = fallback.height;
      }
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);

    cameraRef.current = camera;

    camera
      .start()
      .then(() => {
        setCameraActive(true);
      })
      .catch((err: unknown) => {
        const error = err as DOMException;

        // Show user-friendly error message
        if (error.name === "NotReadableError") {
          alert(
            "카메라를 사용할 수 없습니다.\n\n" +
              "다른 애플리케이션(디스코드, Zoom, Teams 등)에서\n" +
              "카메라를 사용 중일 수 있습니다.\n\n" +
              "다른 앱에서 카메라를 끄고 페이지를 새로고침해주세요.",
          );
        } else if (error.name === "NotAllowedError") {
          alert(
            "카메라 권한이 거부되었습니다.\n\n" + "브라우저 설정에서 카메라 권한을 허용해주세요.",
          );
        } else if (error.name === "NotFoundError") {
          alert("카메라를 찾을 수 없습니다.\n\n" + "카메라가 연결되어 있는지 확인해주세요.");
        } else {
          alert(
            "카메라를 시작할 수 없습니다.\n\n" +
              `에러: ${error.message}\n\n` +
              "페이지를 새로고침하거나 브라우저를 재시작해주세요.",
          );
        }

        // Fallback dimensions
        const fallback = {
          width: 400,
          height: 300,
          aspectRatio: 4 / 3,
          nativeWidth: 640,
          nativeHeight: 480,
        };
        setCanvasDimensions(fallback);
        displayCanvas.width = fallback.width;
        displayCanvas.height = fallback.height;
        captureCanvas.width = fallback.width;
        captureCanvas.height = fallback.height;
      });

    // 4. Cleanup
    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      cameraRef.current?.stop();
      poseRef.current?.close();
      setCameraActive(false);
    };
  }, [videoRef, displayCanvasRef, captureCanvasRef, calculateDimensionsFromVideo]);

  // 4. 결과 처리 함수 (Detection + Drawing 분리)
  const onResults = (results: Results) => {
    // ✅ 1. Landmarks 감지 결과 저장 (항상 실행 - 유효성 검사, 분석에 사용)
    setLatestLandmarks(results);

    // ✅ 2. Display Canvas 렌더링 (사용자에게 보여지는 화면)
    if (displayCanvasRef.current) {
      const displayCtx = displayCanvasRef.current.getContext("2d");
      if (displayCtx) {
        displayCtx.save();
        displayCtx.clearRect(0, 0, displayCanvasRef.current.width, displayCanvasRef.current.height);

        // 원본 비디오 이미지 그리기
        displayCtx.drawImage(
          results.image,
          0,
          0,
          displayCanvasRef.current.width,
          displayCanvasRef.current.height,
        );

        // 디버그 모드에서만 랜드마크 그리기
        if (isDebugMode && results.poseLandmarks) {
          // 뼈대 (Link)
          drawConnectors(displayCtx, results.poseLandmarks, POSE_CONNECTIONS, {
            color: "#00FF00",
            lineWidth: 2,
          });

          // 관절 (Point)
          drawLandmarks(displayCtx, results.poseLandmarks, {
            color: "#FF0000",
            lineWidth: 1,
            radius: 3,
          });
        }

        displayCtx.restore();
      }
    }

    // ✅ 3. Capture Canvas 렌더링 (S3 업로드용 - 순수 비디오만)
    if (captureCanvasRef.current) {
      const captureCtx = captureCanvasRef.current.getContext("2d");
      if (captureCtx) {
        captureCtx.save();
        captureCtx.clearRect(0, 0, captureCanvasRef.current.width, captureCanvasRef.current.height);

        // 순수 비디오 프레임만 그리기 (시각화 요소 없음)
        captureCtx.drawImage(
          results.image,
          0,
          0,
          captureCanvasRef.current.width,
          captureCanvasRef.current.height,
        );

        captureCtx.restore();
      }
    }
  };

  return {
    cameraActive,
    latestLandmarks, // 유효성 검사 및 분석에 사용 가능
    canvasDimensions, // Export dimensions for component use
  };
};
