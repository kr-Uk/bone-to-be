import type { NormalizedLandmark, Results } from "@mediapipe/pose";

/**
 * 자세 검증 결과
 */
export interface PoseValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  score: number; // 0-100 점수
  details: {
    poseDetected: boolean;
    fullBodyVisible: boolean;
    facingFront: boolean;
    armsDown: boolean;
    legsVisible: boolean;
    minVisibility: number;
  };
}

/**
 * MediaPipe Pose Landmarks 인덱스
 */
export const POSE_LANDMARKS = {
  NOSE: 0,
  LEFT_EYE_INNER: 1,
  LEFT_EYE: 2,
  LEFT_EYE_OUTER: 3,
  RIGHT_EYE_INNER: 4,
  RIGHT_EYE: 5,
  RIGHT_EYE_OUTER: 6,
  LEFT_EAR: 7,
  RIGHT_EAR: 8,
  MOUTH_LEFT: 9,
  MOUTH_RIGHT: 10,
  LEFT_SHOULDER: 11,
  RIGHT_SHOULDER: 12,
  LEFT_ELBOW: 13,
  RIGHT_ELBOW: 14,
  LEFT_WRIST: 15,
  RIGHT_WRIST: 16,
  LEFT_PINKY: 17,
  RIGHT_PINKY: 18,
  LEFT_INDEX: 19,
  RIGHT_INDEX: 20,
  LEFT_THUMB: 21,
  RIGHT_THUMB: 22,
  LEFT_HIP: 23,
  RIGHT_HIP: 24,
  LEFT_KNEE: 25,
  RIGHT_KNEE: 26,
  LEFT_ANKLE: 27,
  RIGHT_ANKLE: 28,
  LEFT_HEEL: 29,
  RIGHT_HEEL: 30,
  LEFT_FOOT_INDEX: 31,
  RIGHT_FOOT_INDEX: 32,
} as const;

/**
 * 각도 계산 (degree)
 */
function calculateAngle(
  a: NormalizedLandmark,
  b: NormalizedLandmark,
  c: NormalizedLandmark,
): number {
  const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
  let angle = Math.abs((radians * 180.0) / Math.PI);

  if (angle > 180.0) {
    angle = 360 - angle;
  }

  return angle;
}

/**
 * 1. 포즈가 감지되었는지 확인
 */
function checkPoseDetected(landmarks: NormalizedLandmark[]): boolean {
  return landmarks && landmarks.length === 33;
}

/**
 * 2. 전신이 화면에 보이는지 확인
 * (머리부터 발목까지 모든 주요 랜드마크가 화면 안에 있어야 함)
 */
function checkFullBodyVisible(landmarks: NormalizedLandmark[]): {
  visible: boolean;
  minVisibility: number;
} {
  // 전신 확인을 위한 주요 랜드마크
  const keyPoints = [
    POSE_LANDMARKS.NOSE, // 머리
    POSE_LANDMARKS.LEFT_SHOULDER,
    POSE_LANDMARKS.RIGHT_SHOULDER, // 어깨
    POSE_LANDMARKS.LEFT_HIP,
    POSE_LANDMARKS.RIGHT_HIP, // 골반
    POSE_LANDMARKS.LEFT_KNEE,
    POSE_LANDMARKS.RIGHT_KNEE, // 무릎
    POSE_LANDMARKS.LEFT_ANKLE,
    POSE_LANDMARKS.RIGHT_ANKLE, // 발목
  ];

  let minVisibility = 1.0;
  let allVisible = true;

  for (const idx of keyPoints) {
    const landmark = landmarks[idx];
    if (!landmark || landmark.visibility === undefined || landmark.visibility < 0.35) {
      allVisible = false;
    }
    if (landmark && landmark.visibility !== undefined) {
      minVisibility = Math.min(minVisibility, landmark.visibility);
    }
  }

  // 화면 경계 체크 (x, y가 0~1 범위 내에 있어야 함)
  const headY = landmarks[POSE_LANDMARKS.NOSE].y;
  const leftAnkleY = landmarks[POSE_LANDMARKS.LEFT_ANKLE].y;
  const rightAnkleY = landmarks[POSE_LANDMARKS.RIGHT_ANKLE].y;

  // 머리가 너무 위쪽에 있거나 발이 너무 아래쪽에 있으면 잘림
  const headCutOff = headY < 0.1; // 상단 10% 이내
  const feetCutOff = Math.max(leftAnkleY, rightAnkleY) > 0.9; // 하단 10% 이내

  return {
    visible: allVisible && !headCutOff && !feetCutOff,
    minVisibility,
  };
}

/**
 * 3. 정면을 향하고 있는지 확인
 * (양쪽 어깨가 비슷한 크기로 보여야 함)
 */
function checkFacingFront(landmarks: NormalizedLandmark[]): boolean {
  const leftShoulder = landmarks[POSE_LANDMARKS.LEFT_SHOULDER];
  const rightShoulder = landmarks[POSE_LANDMARKS.RIGHT_SHOULDER];
  const leftHip = landmarks[POSE_LANDMARKS.LEFT_HIP];
  const rightHip = landmarks[POSE_LANDMARKS.RIGHT_HIP];

  // 어깨 너비와 골반 너비 계산
  const shoulderWidth = Math.abs(leftShoulder.x - rightShoulder.x);
  const hipWidth = Math.abs(leftHip.x - rightHip.x);

  // 어깨와 골반의 비율이 비슷해야 정면
  const ratio = shoulderWidth / hipWidth;

  // 양쪽 어깨의 visibility 차이가 크지 않아야 함
  const visibilityDiff = Math.abs((leftShoulder.visibility || 0) - (rightShoulder.visibility || 0));

  return ratio > 0.65 && ratio < 1.6 && visibilityDiff < 0.5;
}

/**
 * 4. 팔이 자연스럽게 내려가 있는지 확인
 * (손목이 골반보다 아래에 있고, 팔꿈치 각도가 적절해야 함)
 */
function checkArmsDown(landmarks: NormalizedLandmark[]): boolean {
  const leftShoulder = landmarks[POSE_LANDMARKS.LEFT_SHOULDER];
  const rightShoulder = landmarks[POSE_LANDMARKS.RIGHT_SHOULDER];
  const leftElbow = landmarks[POSE_LANDMARKS.LEFT_ELBOW];
  const rightElbow = landmarks[POSE_LANDMARKS.RIGHT_ELBOW];
  const leftWrist = landmarks[POSE_LANDMARKS.LEFT_WRIST];
  const rightWrist = landmarks[POSE_LANDMARKS.RIGHT_WRIST];
  const leftHip = landmarks[POSE_LANDMARKS.LEFT_HIP];
  const rightHip = landmarks[POSE_LANDMARKS.RIGHT_HIP];

  // 손목이 골반보다 아래 또는 비슷한 높이에 있어야 함
  const leftWristBelowHip = leftWrist.y >= leftHip.y - 0.1;
  const rightWristBelowHip = rightWrist.y >= rightHip.y - 0.1;

  // 팔꿈치 각도 확인 (어깨-팔꿈치-손목)
  const leftElbowAngle = calculateAngle(leftShoulder, leftElbow, leftWrist);
  const rightElbowAngle = calculateAngle(rightShoulder, rightElbow, rightWrist);

  // 팔이 자연스럽게 펴져 있어야 함 (각도가 100도 이상)
  const leftArmStraight = leftElbowAngle > 100;
  const rightArmStraight = rightElbowAngle > 100;

  return (leftWristBelowHip || rightWristBelowHip) && (leftArmStraight || rightArmStraight);
}

/**
 * 5. 다리가 제대로 보이는지 확인
 */
function checkLegsVisible(landmarks: NormalizedLandmark[]): boolean {
  const leftKnee = landmarks[POSE_LANDMARKS.LEFT_KNEE];
  const rightKnee = landmarks[POSE_LANDMARKS.RIGHT_KNEE];
  const leftAnkle = landmarks[POSE_LANDMARKS.LEFT_ANKLE];
  const rightAnkle = landmarks[POSE_LANDMARKS.RIGHT_ANKLE];

  // 무릎과 발목의 visibility 확인
  const kneesVisible = (leftKnee.visibility || 0) > 0.5 && (rightKnee.visibility || 0) > 0.5;
  const anklesVisible = (leftAnkle.visibility || 0) > 0.5 && (rightAnkle.visibility || 0) > 0.5;

  return kneesVisible && anklesVisible;
}

/**
 * 전신 사진 자세 검증
 */
export function validateFullBodyPose(results: Results | null): PoseValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  let score = 100;

  // 기본 결과
  const result: PoseValidationResult = {
    isValid: false,
    errors,
    warnings,
    score: 0,
    details: {
      poseDetected: false,
      fullBodyVisible: false,
      facingFront: false,
      armsDown: false,
      legsVisible: false,
      minVisibility: 0,
    },
  };

  // 1. 포즈가 감지되었는지
  if (!results || !results.poseLandmarks) {
    errors.push("포즈가 감지되지 않았습니다. 카메라 앞에서 전신이 보이도록 서주세요.");
    return result;
  }

  const landmarks = results.poseLandmarks;
  result.details.poseDetected = checkPoseDetected(landmarks);

  if (!result.details.poseDetected) {
    errors.push("포즈 데이터가 올바르지 않습니다.");
    return result;
  }

  // 2. 전신이 화면에 보이는지
  const fullBodyCheck = checkFullBodyVisible(landmarks);
  result.details.fullBodyVisible = fullBodyCheck.visible;
  result.details.minVisibility = fullBodyCheck.minVisibility;

  if (!fullBodyCheck.visible) {
    errors.push("전신이 잘 보이지 않습니다. 카메라와 거리를 조금 띄워주세요.");
    score -= 30;
  }

  if (fullBodyCheck.minVisibility < 0.5) {
    warnings.push(
      "일부 신체 부위의 인식률이 낮습니다. 조명을 밝게 하거나 카메라와의 거리를 조정해주세요.",
    );
    score -= 10;
  }

  // 3. 정면을 향하고 있는지
  result.details.facingFront = checkFacingFront(landmarks);
  if (!result.details.facingFront) {
    warnings.push("정면을 향하면 더 정확한 분석이 가능합니다.");
    score -= 10;
  }

  // 4. 팔이 자연스럽게 내려가 있는지
  result.details.armsDown = checkArmsDown(landmarks);
  if (!result.details.armsDown) {
    warnings.push("팔을 자연스럽게 내리면 분석에 도움이 됩니다.");
    score -= 5;
  }

  // 5. 다리가 제대로 보이는지
  result.details.legsVisible = checkLegsVisible(landmarks);
  if (!result.details.legsVisible) {
    // 다리 가시성은 전신 가시성 체크에서 이미 확인하므로 감점하지 않음
    warnings.push("다리가 명확하게 보이지 않습니다. 전신이 보이도록 카메라 거리를 조정해주세요.");
  }

  // 최종 점수 및 유효성 판단
  result.score = Math.max(0, score);
  result.isValid = errors.length === 0 && result.score >= 40;

  return result;
}
