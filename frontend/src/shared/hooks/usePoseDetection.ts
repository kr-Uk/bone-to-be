import { Camera } from "@mediapipe/camera_utils";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import { Pose, POSE_CONNECTIONS, type Results, type Options as PoseOptions } from "@mediapipe/pose";
import { useEffect, useRef, useState, type RefObject } from "react";

import { size } from "../constants";

export const usePoseDetection = (
  videoRef: RefObject<HTMLVideoElement | null>,
  canvasRef: RefObject<HTMLCanvasElement | null>,
) => {
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [latestLandmarks, setLatestLandmarks] = useState<Results | null>(null);
  const poseRef = useRef<Pose | null>(null);
  const cameraRef = useRef<Camera | null>(null);

  // 환경변수로 디버그 모드 확인
  const isDebugMode = import.meta.env.VITE_DEBUG_LANDMARKS === "true";

  useEffect(() => {
    // null check: DOM 요소가 마운트되었는지 확인
    if (!videoRef.current || !canvasRef.current) return;

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

    // 2. Camera 인스턴스 설정 (3:4 비율 - 세로가 긴 비율)
    const camera = new Camera(videoRef.current, {
      onFrame: async () => {
        if (videoRef.current && poseRef.current) {
          await poseRef.current.send({ image: videoRef.current });
        }
      },
      width: size.width,
      height: size.height,
    });

    cameraRef.current = camera;
    camera.start();
    setCameraActive(true);

    // 3. Cleanup
    return () => {
      cameraRef.current?.stop();
      poseRef.current?.close();
      setCameraActive(false);
    };
  }, [videoRef, canvasRef]);

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

    // 캔버스 크기 고정 (3:4 비율 - 세로가 긴 비율)
    if (canvas.width !== 480) canvas.width = 480;
    if (canvas.height !== 640) canvas.height = 640;

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
