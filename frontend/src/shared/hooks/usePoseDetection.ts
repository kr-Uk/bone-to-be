import { Camera } from "@mediapipe/camera_utils";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import { Pose, POSE_CONNECTIONS, type Results, type Options as PoseOptions } from "@mediapipe/pose";
import { useEffect, useRef, useState, type RefObject } from "react";

export const usePoseDetection = (
  videoRef: RefObject<HTMLVideoElement | null>,
  canvasRef: RefObject<HTMLCanvasElement | null>,
  previewWrapperRef: RefObject<HTMLDivElement | null>,
) => {
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [latestLandmarks, setLatestLandmarks] = useState<Results | null>(null);
  const poseRef = useRef<Pose | null>(null);
  const cameraRef = useRef<Camera | null>(null);

  // 환경변수로 디버그 모드 확인
  const isDebugMode = import.meta.env.VITE_DEBUG_LANDMARKS === "true";

  useEffect(() => {
    // null check: DOM 요소가 마운트되었는지 확인
    if (!videoRef.current || !canvasRef.current || !previewWrapperRef.current) return;

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

    // 2. Canvas 크기를 PreviewWrapper에 맞춤 (동적)
    const updateCanvasSize = () => {
      if (!canvasRef.current || !previewWrapperRef.current) return;

      const wrapper = previewWrapperRef.current;
      const rect = wrapper.getBoundingClientRect();

      // Canvas 내부 크기를 CSS 렌더링 크기와 동일하게 설정
      const newWidth = Math.floor(rect.width);
      const newHeight = Math.floor(rect.height);

      if (canvasRef.current.width !== newWidth || canvasRef.current.height !== newHeight) {
        canvasRef.current.width = newWidth;
        canvasRef.current.height = newHeight;

        console.log("Canvas 크기 조정:", newWidth, "x", newHeight);
      }
    };

    // 초기 크기 설정 (다음 프레임에서 실행)
    const frameId = requestAnimationFrame(() => {
      updateCanvasSize();

      // 3. Camera 인스턴스 설정 (Canvas 크기 확정 후)
      if (!videoRef.current || !canvasRef.current) return;

      const camera = new Camera(videoRef.current, {
        onFrame: async () => {
          if (videoRef.current && poseRef.current) {
            await poseRef.current.send({ image: videoRef.current });
          }
        },
        width: canvasRef.current.width,
        height: canvasRef.current.height,
      });

      cameraRef.current = camera;
      camera.start();
      setCameraActive(true);
    });

    // 4. ResizeObserver로 반응형 대응
    const resizeObserver = new ResizeObserver(() => {
      updateCanvasSize();
    });

    resizeObserver.observe(previewWrapperRef.current);

    // 5. Cleanup
    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      cameraRef.current?.stop();
      poseRef.current?.close();
      setCameraActive(false);
    };
  }, [videoRef, canvasRef, previewWrapperRef]);

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

  return {
    cameraActive,
    latestLandmarks, // 유효성 검사 및 분석에 사용 가능
  };
};
