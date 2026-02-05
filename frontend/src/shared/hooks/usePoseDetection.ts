import { Camera } from "@mediapipe/camera_utils";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import { Pose, POSE_CONNECTIONS, type Results, type Options as PoseOptions } from "@mediapipe/pose";
import { useCallback, useEffect, useRef, useState, type RefObject } from "react";

import type { OptimalDimensions } from "@/shared/utils";

const MAX_CANVAS_WIDTH = 400;

export const usePoseDetection = (
  videoRef: RefObject<HTMLVideoElement | null>,
  canvasRef: RefObject<HTMLCanvasElement | null>,
) => {
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
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

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

        // Update canvas size based on actual video resolution
        canvas.width = dimensions.width;
        canvas.height = dimensions.height;
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
        canvas.width = fallback.width;
        canvas.height = fallback.height;
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
        canvas.width = fallback.width;
        canvas.height = fallback.height;
      });

    // 4. Cleanup
    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      cameraRef.current?.stop();
      poseRef.current?.close();
      setCameraActive(false);
    };
  }, [videoRef, canvasRef, calculateDimensionsFromVideo]);

  // 4. 결과 처리 함수 (Detection + Drawing 분리)
  const onResults = (results: Results) => {
    // ✅ 1. Landmarks 감지 결과 저장 (항상 실행 - 유효성 검사, 분석에 사용)
    setLatestLandmarks(results);

    // ✅ 2. Canvas 렌더링 (조건부)
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Canvas 크기는 이미 PreviewWrapper 크기로 동적 설정됨
    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 원본 비디오 이미지 그리기 (항상)
    ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

    // ✅ 3. 포즈 랜드마크 그리기 (디버그 모드에서만)
    if (isDebugMode && results.poseLandmarks) {
      // 뼈대 (Link)
      drawConnectors(ctx, results.poseLandmarks, POSE_CONNECTIONS, {
        color: "#00FF00",
        lineWidth: 2,
      });

      // 관절 (Point)
      drawLandmarks(ctx, results.poseLandmarks, {
        color: "#FF0000",
        lineWidth: 1,
        radius: 3,
      });
    }

    ctx.restore();
  };

  return {
    cameraActive,
    latestLandmarks, // 유효성 검사 및 분석에 사용 가능
    canvasDimensions, // Export dimensions for component use
  };
};
