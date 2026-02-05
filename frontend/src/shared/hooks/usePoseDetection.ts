import { Camera } from "@mediapipe/camera_utils";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import { Pose, POSE_CONNECTIONS, type Results, type Options as PoseOptions } from "@mediapipe/pose";
import { useEffect, useRef, useState, type RefObject } from "react";

// 최대 크기 제한 (비율은 동적으로 계산)
const MAX_CANVAS_WIDTH = 400;
const MAX_CANVAS_HEIGHT = 800; // 세로 모드 대응

export const usePoseDetection = (
  videoRef: RefObject<HTMLVideoElement | null>,
  canvasRef: RefObject<HTMLCanvasElement | null>,
) => {
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [latestLandmarks, setLatestLandmarks] = useState<Results | null>(null);
  const poseRef = useRef<Pose | null>(null);
  const cameraRef = useRef<Camera | null>(null);

  // 동적 크기 state 추가
  const [canvasSize, setCanvasSize] = useState({ width: 400, height: 300 });
  const [aspectRatio, setAspectRatio] = useState(4 / 3);

  // 가로 비율 감지 state 추가
  const [isLandscape, setIsLandscape] = useState(false);

  // 카메라 모드 state (후면 카메라 기본)
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");

  // 환경변수로 디버그 모드 확인
  const isDebugMode = import.meta.env.VITE_DEBUG_LANDMARKS === "true";

  // 카메라 해상도 감지 및 세로 비율 검증
  useEffect(() => {
    if (!videoRef.current) return;

    const handleLoadedMetadata = () => {
      const video = videoRef.current!;
      const actualWidth = video.videoWidth;
      const actualHeight = video.videoHeight;

      if (actualWidth && actualHeight) {
        const ratio = actualWidth / actualHeight;

        console.log(`카메라 해상도: ${actualWidth}x${actualHeight}, 비율: ${ratio.toFixed(2)}`);

        // 가로 비율 감지 (ratio > 1.0은 가로가 더 긴 경우)
        if (ratio > 1.0) {
          setIsLandscape(true);
          // 가로 모드는 Canvas 설정하지 않음
          return;
        }

        setIsLandscape(false);

        // 세로 비율만 허용 (ratio <= 1.0)
        // 최대 크기 내에서 비율 유지하며 계산
        let width = MAX_CANVAS_WIDTH;
        let height = width / ratio;

        // 높이가 최대값을 초과하면 높이 기준으로 재계산
        if (height > MAX_CANVAS_HEIGHT) {
          height = MAX_CANVAS_HEIGHT;
          width = height * ratio;
        }

        setCanvasSize({
          width: Math.round(width),
          height: Math.round(height),
        });
        setAspectRatio(ratio);

        console.log(`Canvas 크기 설정: ${Math.round(width)}x${Math.round(height)}`);
      }
    };

    videoRef.current.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      videoRef.current?.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, []);

  useEffect(() => {
    // null check: DOM 요소가 마운트되었는지 확인
    if (!videoRef.current || !canvasRef.current) return;

    // 가로 모드일 때는 Camera 시작하지 않음
    if (isLandscape) {
      console.log("가로 모드 감지: Camera 비활성화");
      return;
    }

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

    // 2. Canvas 크기 동적 설정
    if (canvasRef.current) {
      canvasRef.current.width = canvasSize.width;
      canvasRef.current.height = canvasSize.height;
      console.log("Canvas 크기 동적 설정:", canvasSize.width, "x", canvasSize.height);
    }

    // 3. Camera 인스턴스 설정 (후면 카메라 우선)
    const startCamera = async () => {
      try {
        // 기존 스트림이 있으면 정지
        if (videoRef.current?.srcObject) {
          const stream = videoRef.current.srcObject as MediaStream;
          stream.getTracks().forEach((track) => track.stop());
        }

        // 후면 카메라로 스트림 요청
        const constraints = {
          video: {
            facingMode: facingMode,
            // 해상도는 브라우저가 자동으로 선택하도록 함
          },
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        // Camera 인스턴스 설정
        const camera = new Camera(videoRef.current!, {
          onFrame: async () => {
            if (videoRef.current && poseRef.current) {
              await poseRef.current.send({ image: videoRef.current });
            }
          },
          width: canvasSize.width,
          height: canvasSize.height,
        });

        cameraRef.current = camera;
        camera.start();
        setCameraActive(true);
        console.log(`카메라 시작 (모드: ${facingMode})`);
      } catch (error) {
        console.error("카메라 시작 실패:", error);
        setCameraActive(false);
      }
    };

    startCamera();

    // 4. Cleanup
    return () => {
      cameraRef.current?.stop();
      poseRef.current?.close();
      setCameraActive(false);

      // 스트림 정지
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [videoRef, canvasRef, canvasSize, facingMode, isLandscape]);

  // 4. 결과 처리 함수 (Detection + Drawing 분리)
  const onResults = (results: Results) => {
    // ✅ 1. Landmarks 감지 결과 저장 (항상 실행 - 유효성 검사, 분석에 사용)
    console.log(onResults);
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

  // 카메라 전환 함수
  const switchCamera = () => {
    // 현재 스트림 정지
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
    }

    // facingMode 전환
    const newMode = facingMode === "user" ? "environment" : "user";
    setFacingMode(newMode);
    console.log(`카메라 전환: ${facingMode} -> ${newMode}`);
  };

  return {
    cameraActive,
    latestLandmarks, // 유효성 검사 및 분석에 사용 가능
    aspectRatio,
    canvasWidth: canvasSize.width,
    canvasHeight: canvasSize.height,
    isLandscape, // 가로 모드 감지
    switchCamera, // 카메라 전환 함수
    currentFacingMode: facingMode, // 현재 카메라 (user/environment)
  };
};
