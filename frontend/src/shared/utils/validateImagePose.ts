import { Pose } from "@mediapipe/pose";

import { validateFullBodyPose } from "./poseValidation";

import type { PoseValidationResult } from "./poseValidation";

/**
 * 정적 이미지에 대한 포즈 검증
 * @param imageDataUrl - base64 인코딩된 이미지 데이터 URL
 * @returns 포즈 검증 결과
 */
export async function validateImagePose(imageDataUrl: string): Promise<PoseValidationResult> {
  return new Promise((resolve) => {
    // 이미지 엘리먼트 생성
    const img = new Image();

    img.onload = async () => {
      // MediaPipe Pose 인스턴스 생성
      const pose = new Pose({
        locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
        },
      });

      // Pose 설정
      pose.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        enableSegmentation: false,
        smoothSegmentation: false,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      // 결과 처리
      pose.onResults((results) => {
        const validationResult = validateFullBodyPose(results);
        resolve(validationResult);
        pose.close();
      });

      // 이미지 전송
      await pose.send({ image: img });
    };

    img.onerror = () => {
      // 이미지 로드 실패 시 기본 오류 결과 반환
      resolve({
        isValid: false,
        errors: ["이미지를 불러올 수 없습니다. 올바른 이미지 파일인지 확인해주세요."],
        warnings: [],
        score: 0,
        details: {
          poseDetected: false,
          fullBodyVisible: false,
          facingFront: false,
          armsDown: false,
          legsVisible: false,
          minVisibility: 0,
        },
      });
    };

    img.src = imageDataUrl;
  });
}
