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
    let pose: Pose | null = null;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let isResolved = false;

    const cleanup = () => {
      if (pose) {
        pose.close();
        pose = null;
      }
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
    };

    const resolveOnce = (result: PoseValidationResult) => {
      if (!isResolved) {
        isResolved = true;
        cleanup();
        resolve(result);
      }
    };

    img.onload = async () => {
      try {
        // MediaPipe Pose 인스턴스 생성
        pose = new Pose({
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
          resolveOnce(validationResult);
        });

        // 이미지 전송
        await pose.send({ image: img });
      } catch {
        resolveOnce({
          isValid: false,
          errors: ["이미지 처리 중 오류가 발생했습니다."],
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
      }
    };

    img.onerror = () => {
      // 이미지 로드 실패 시 기본 오류 결과 반환
      resolveOnce({
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

    // Timeout 추가 (10초)
    timeoutId = setTimeout(() => {
      resolveOnce({
        isValid: false,
        errors: ["이미지 처리 시간이 초과되었습니다. 다시 시도해주세요."],
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
    }, 10000);

    img.src = imageDataUrl;
  });
}
