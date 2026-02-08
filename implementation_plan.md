# Body Type Analysis 구현 계획 (최종)

> ✅ **결정**: 옵션 2 - AI는 지표만 계산, 백엔드가 분류 수행

## 1. RabbitMQ 메시지 구조

### Request (Spring Boot → AI Worker)

**변경 없음** - 기존 구조 유지:
```json
{
  "image_url": "https://bucket.s3.amazonaws.com/image.jpg",
  "gender": "neutral",
  "correlation_id": "uuid-here"
}
```

### Response (AI Worker → Spring Boot)

**간소화된 구조**:
```json
{
  "correlation_id": "uuid-here",
  "status": "success",
  "result": {
    "body_type_metrics": {
      "shoulder_slope_angle": 12.5,
      "shoulder_width_index": 0.240,
      "hip_width_index": 0.248,
      "shoulder_hip_ratio": 0.97,
      "upper_body_depth_index": 0.29,
      "ribcage_volume_index": 0.033,
      "waist_curvature_index": 0.18,
      "joint_thickness_index": 0.0115,
      "arm_torso_ratio": 1.02,
      "linearity_index": 0.65
    },
    "measurements": {
      "height": 1.713,
      "chest": 1.031,
      "waist": 0.902,
      "hips": 0.999
    }
  }
}
```

**데이터 크기 비교**:
- Before: ~10MB (vertices + faces)
- After: ~1KB (10개 지표 + 측정값)

---

## 2. Spring Boot 구현

### DTO 클래스

```java
// Request (변경 없음)
@Data
public class BodyAnalysisRequest {
    @JsonProperty("image_url")
    private String imageUrl;
    
    @JsonProperty("gender")
    private String gender = "neutral";
    
    @JsonProperty("correlation_id")
    private String correlationId;
}

// Response
@Data
public class BodyAnalysisResponse {
    @JsonProperty("correlation_id")
    private String correlationId;
    
    private String status;
    private Result result;
    
    @Data
    public static class Result {
        @JsonProperty("body_type_metrics")
        private BodyTypeMetrics bodyTypeMetrics;
        
        private Measurements measurements;
    }
}

@Data
public class BodyTypeMetrics {
    @JsonProperty("shoulder_slope_angle")
    private Double shoulderSlopeAngle;      // deg
    
    @JsonProperty("shoulder_width_index")
    private Double shoulderWidthIndex;      // SW/H
    
    @JsonProperty("hip_width_index")
    private Double hipWidthIndex;           // HW/H
    
    @JsonProperty("shoulder_hip_ratio")
    private Double shoulderHipRatio;        // SW/HW
    
    @JsonProperty("upper_body_depth_index")
    private Double upperBodyDepthIndex;     // Dchest/SW
    
    @JsonProperty("ribcage_volume_index")
    private Double ribcageVolumeIndex;      // Achest/H^2
    
    @JsonProperty("waist_curvature_index")
    private Double waistCurvatureIndex;     // (HW-WW)/HW
    
    @JsonProperty("joint_thickness_index")
    private Double jointThicknessIndex;     // Rj/H
    
    @JsonProperty("arm_torso_ratio")
    private Double armTorsoRatio;           // Arm/Torso
    
    @JsonProperty("linearity_index")
    private Double linearityIndex;          // 직선성
}

@Data
public class Measurements {
    private Double height;  // m
    private Double chest;   // m
    private Double waist;   // m
    private Double hips;    // m
}
```

### 분류 로직

```java
@Service
public class BodyTypeClassifier {
    
    public BodyTypeResult classify(BodyTypeMetrics m) {
        int sScore = 0, nScore = 0, wScore = 0;
        
        // 1. Shoulder Slope
        if (m.getShoulderSlopeAngle() <= 8) sScore++;
        else if (m.getShoulderSlopeAngle() <= 14) nScore++;
        else wScore++;
        
        // 2. Shoulder Width Index
        if (m.getShoulderWidthIndex() < 0.225) wScore++;
        else if (m.getShoulderWidthIndex() <= 0.255) sScore++;
        else nScore++;
        
        // 3. Hip Width Index
        if (m.getHipWidthIndex() >= 0.225 && m.getHipWidthIndex() <= 0.255) sScore++;
        else if (m.getHipWidthIndex() > 0.235 && m.getHipWidthIndex() <= 0.265) nScore++;
        else if (m.getHipWidthIndex() > 0.255) wScore++;
        
        // 4. Shoulder-Hip Ratio
        if (m.getShoulderHipRatio() < 0.95) wScore++;
        else if (m.getShoulderHipRatio() <= 1.05) sScore++;
        else nScore++;
        
        // 5. Upper Body Depth
        if (m.getUpperBodyDepthIndex() < 0.28) wScore++;
        else if (m.getUpperBodyDepthIndex() <= 0.32) nScore++;
        else sScore++;
        
        // 6. Ribcage Volume
        if (m.getRibcageVolumeIndex() < 0.030) wScore++;
        else if (m.getRibcageVolumeIndex() <= 0.036) nScore++;
        else sScore++;
        
        // 7. Waist Curvature
        if (m.getWaistCurvatureIndex() < 0.14) sScore++;
        else if (m.getWaistCurvatureIndex() <= 0.22) nScore++;
        else wScore++;
        
        // 8. Joint Thickness
        if (m.getJointThicknessIndex() < 0.0105) wScore++;
        else if (m.getJointThicknessIndex() <= 0.0125) sScore++;
        else nScore++;
        
        // 9. Arm-Torso Ratio
        if (m.getArmTorsoRatio() < 0.98) sScore++;
        else if (m.getArmTorsoRatio() <= 1.05) wScore++;
        else nScore++;
        
        // 10. Linearity
        if (m.getLinearityIndex() < 0.62) wScore++;
        else if (m.getLinearityIndex() <= 0.70) nScore++;
        else sScore++;
        
        // 결과
        int total = sScore + nScore + wScore;
        return BodyTypeResult.builder()
            .scores(Map.of("S", sScore, "N", nScore, "W", wScore))
            .ratios(Map.of(
                "S", (double) sScore / total,
                "N", (double) nScore / total,
                "W", (double) wScore / total
            ))
            .primaryType(getPrimaryType(sScore, nScore, wScore))
            .confidence(getConfidence(sScore, nScore, wScore, total))
            .build();
    }
    
    private String getPrimaryType(int s, int n, int w) {
        if (s > n && s > w) return "Straight";
        if (n > s && n > w) return "Natural";
        return "Wave";
    }
    
    private double getConfidence(int s, int n, int w, int total) {
        int max = Math.max(s, Math.max(n, w));
        return (double) max / total;  // 0.5 ~ 1.0
    }
}
```

---

## 3. AI Worker 구현 계획

### 파일 구조
```
ai/shapy/
├── body_type_analyzer.py  [NEW] - 10개 지표 계산
└── smplx_joints.py        [NEW] - SMPL-X joint mapping
```

### `body_type_analyzer.py`

```python
import numpy as np
from typing import Dict
from .smplx_joints import JOINT_INDICES

class BodyTypeAnalyzer:
    """
    SMPL-X 3D mesh로부터 body type 분류용 10개 지표 추출
    """
    
    def __init__(self, vertices: np.ndarray, joints: np.ndarray, 
                 measurements: dict):
        """
        Args:
            vertices: (10475, 3) SMPL-X vertices
            joints: (127, 3) SMPL-X joints
            measurements: {'height': 1.713, 'chest': 1.031, ...}
        """
        self.vertices = vertices  # (10475, 3)
        self.joints = joints      # (127, 3)
        self.height = measurements['height'][0]
        self.chest = measurements['chest'][0]
        self.waist = measurements['waist'][0]
        self.hips = measurements['hips'][0]
    
    def calculate_all_metrics(self) -> Dict[str, float]:
        """10개 지표 모두 계산"""
        return {
            'shoulder_slope_angle': self._shoulder_slope(),
            'shoulder_width_index': self._shoulder_width_idx(),
            'hip_width_index': self._hip_width_idx(),
            'shoulder_hip_ratio': self._shoulder_hip_ratio(),
            'upper_body_depth_index': self._upper_depth_idx(),
            'ribcage_volume_index': self._ribcage_volume_idx(),
            'waist_curvature_index': self._waist_curvature_idx(),
            'joint_thickness_index': self._joint_thickness_idx(),
            'arm_torso_ratio': self._arm_torso_ratio(),
            'linearity_index': self._linearity_idx()
        }
    
    def _shoulder_slope(self) -> float:
        """1. 어깨선 각도 (deg)"""
        neck = self.joints[JOINT_INDICES['neck']]
        l_shoulder = self.joints[JOINT_INDICES['left_shoulder']]
        r_shoulder = self.joints[JOINT_INDICES['right_shoulder']]
        
        # 좌우 각도 계산
        left_angle = np.degrees(np.arctan2(
            abs(l_shoulder[1] - neck[1]),
            abs(l_shoulder[0] - neck[0])
        ))
        right_angle = np.degrees(np.arctan2(
            abs(r_shoulder[1] - neck[1]),
            abs(r_shoulder[0] - neck[0])
        ))
        
        return (left_angle + right_angle) / 2
    
    def _shoulder_width_idx(self) -> float:
        """2. 어깨너비 지수"""
        l_shoulder = self.joints[JOINT_INDICES['left_shoulder']]
        r_shoulder = self.joints[JOINT_INDICES['right_shoulder']]
        shoulder_width = np.linalg.norm(l_shoulder - r_shoulder)
        return shoulder_width / self.height
    
    def _hip_width_idx(self) -> float:
        """3. 골반너비 지수"""
        l_hip = self.joints[JOINT_INDICES['left_hip']]
        r_hip = self.joints[JOINT_INDICES['right_hip']]
        hip_width = np.linalg.norm(l_hip - r_hip)
        return hip_width / self.height
    
    def _shoulder_hip_ratio(self) -> float:
        """4. 어깨/골반 비율"""
        sw_idx = self._shoulder_width_idx()
        hw_idx = self._hip_width_idx()
        return (sw_idx * self.height) / (hw_idx * self.height)
    
    def _upper_depth_idx(self) -> float:
        """5. 상체 두께 지수 - 흉곽 앞뒤 깊이"""
        # Chest level vertices (y 좌표 기준)
        spine2 = self.joints[JOINT_INDICES['spine2']]
        chest_y = spine2[1]
        
        # Chest level 근처 vertices 추출 (±5cm)
        mask = np.abs(self.vertices[:, 1] - chest_y) < 0.05
        chest_vertices = self.vertices[mask]
        
        if len(chest_vertices) < 10:
            return 0.30  # 기본값
        
        # 앞뒤(z) 최대 거리
        depth = chest_vertices[:, 2].max() - chest_vertices[:, 2].min()
        
        l_shoulder = self.joints[JOINT_INDICES['left_shoulder']]
        r_shoulder = self.joints[JOINT_INDICES['right_shoulder']]
        shoulder_width = np.linalg.norm(l_shoulder - r_shoulder)
        
        return depth / shoulder_width
    
    def _ribcage_volume_idx(self) -> float:
        """6. 흉곽 볼륨 지수 - 흉곽 단면적"""
        # Chest perimeter (이미 계산된 값 사용)
        # 단면적 근사: A ≈ (chest / 2π)^2 * π
        chest_area = (self.chest / (2 * np.pi)) ** 2 * np.pi
        return chest_area / (self.height ** 2)
    
    def _waist_curvature_idx(self) -> float:
        """7. 허리 굴곡 지수"""
        # Waist width 추출 (허리 레벨 vertices)
        spine1 = self.joints[JOINT_INDICES['spine1']]
        waist_y = spine1[1]
        
        mask = np.abs(self.vertices[:, 1] - waist_y) < 0.03
        waist_vertices = self.vertices[mask]
        
        if len(waist_vertices) < 10:
            waist_width = self.waist / np.pi  # 근사
        else:
            waist_width = waist_vertices[:, 0].max() - waist_vertices[:, 0].min()
        
        l_hip = self.joints[JOINT_INDICES['left_hip']]
        r_hip = self.joints[JOINT_INDICES['right_hip']]
        hip_width = np.linalg.norm(l_hip - r_hip)
        
        return (hip_width - waist_width) / hip_width
    
    def _joint_thickness_idx(self) -> float:
        """8. 손목/발목 굵기 지수"""
        # Wrist/Ankle level vertices에서 반경 추출
        l_wrist = self.joints[JOINT_INDICES['left_wrist']]
        r_wrist = self.joints[JOINT_INDICES['right_wrist']]
        l_ankle = self.joints[JOINT_INDICES['left_ankle']]
        r_ankle = self.joints[JOINT_INDICES['right_ankle']]
        
        def get_radius(joint_pos, vertices):
            mask = np.linalg.norm(vertices - joint_pos, axis=1) < 0.05
            if mask.sum() < 5:
                return 0.012  # 기본값
            local_verts = vertices[mask]
            return np.std(np.linalg.norm(local_verts - joint_pos, axis=1))
        
        r_wrist_r = get_radius(l_wrist, self.vertices)
        r_ankle_r = get_radius(l_ankle, self.vertices)
        
        avg_radius = (r_wrist_r + r_ankle_r) / 2
        return avg_radius / self.height
    
    def _arm_torso_ratio(self) -> float:
        """9. 팔-몸통 비율"""
        # Arm length
        l_shoulder = self.joints[JOINT_INDICES['left_shoulder']]
        l_wrist = self.joints[JOINT_INDICES['left_wrist']]
        arm_length = np.linalg.norm(l_wrist - l_shoulder)
        
        # Torso length
        neck = self.joints[JOINT_INDICES['neck']]
        pelvis = self.joints[JOINT_INDICES['pelvis']]
        torso_length = np.linalg.norm(pelvis - neck)
        
        return arm_length / torso_length
    
    def _linearity_idx(self) -> float:
        """10. 실루엣 직선성 - 정면 투영 외곽선"""
        # 정면(z=0) 투영
        projection = self.vertices[:, [0, 1]]  # x, y만
        
        # Convex hull로 외곽선 추출
        from scipy.spatial import ConvexHull
        try:
            hull = ConvexHull(projection)
            outline_points = projection[hull.vertices]
        except:
            return 0.65  # 기본값
        
        # 연속된 점들 사이 직선 근사 오차
        total_length = 0
        straight_length = 0
        
        for i in range(len(outline_points)):
            p1 = outline_points[i]
            p2 = outline_points[(i + 1) % len(outline_points)]
            segment_len = np.linalg.norm(p2 - p1)
            total_length += segment_len
            
            # 직선 판단 (다음 점과의 각도 변화)
            if i < len(outline_points) - 1:
                p3 = outline_points[(i + 2) % len(outline_points)]
                v1 = p2 - p1
                v2 = p3 - p2
                angle = np.arccos(np.dot(v1, v2) / 
                                 (np.linalg.norm(v1) * np.linalg.norm(v2) + 1e-8))
                if abs(angle) < np.radians(15):  # 15도 이하면 직선
                    straight_length += segment_len
        
        return straight_length / total_length if total_length > 0 else 0.65
```

### `smplx_joints.py`

```python
# SMPL-X joint indices
JOINT_INDICES = {
    'pelvis': 0,
    'left_hip': 1,
    'right_hip': 2,
    'spine1': 3,
    'left_knee': 4,
    'right_knee': 5,
    'spine2': 6,
    'left_ankle': 7,
    'right_ankle': 8,
    'spine3': 9,
    'left_foot': 10,
    'right_foot': 11,
    'neck': 12,
    'left_collar': 13,
    'right_collar': 14,
    'head': 15,
    'left_shoulder': 16,
    'right_shoulder': 17,
    'left_elbow': 18,
    'right_elbow': 19,
    'left_wrist': 20,
    'right_wrist': 21,
}
```

### `handler.py` 수정

```python
# Shapy inference 후
result = shapy_runner.run(image, body25_kps, gender)

# Body type analysis 추가
from shapy.body_type_analyzer import BodyTypeAnalyzer

analyzer = BodyTypeAnalyzer(
    vertices=result['stage_02']['vertices'][0],  # (10475, 3)
    joints=result['stage_02']['joints'][0],      # (127, 3)
    measurements=result['measurements']
)
body_type_metrics = analyzer.calculate_all_metrics()

# Response 생성
response = {
    'correlation_id': correlation_id,
    'status': 'success',
    'result': {
        'body_type_metrics': body_type_metrics,
        'measurements': {
            'height': result['measurements']['height'][0],
            'chest': result['measurements']['chest'][0],
            'waist': result['measurements']['waist'][0],
            'hips': result['measurements']['hips'][0]
        }
    }
}
```

---

## 4. 데이터 보관 정책

### response_dump.json 처리

**추천: JSONB로 DB 저장** ✅

**이유**:
1. **디버깅**: 문제 발생 시 원본 데이터 확인 가능
2. **A/B 테스트**: 로직 변경 후 과거 데이터로 재계산 가능
3. **개선**: 사용자 피드백 받으면 지표 재조정
4. **통계**: 전체 사용자 지표 분포 분석 가능

**DB 스키마**:
```sql
CREATE TABLE body_analysis_history (
    id BIGSERIAL PRIMARY KEY,
    correlation_id UUID NOT NULL UNIQUE,
    user_id BIGINT,
    image_url TEXT,
    
    -- AI 결과 (JSONB)
    ai_response JSONB NOT NULL,
    
    -- 분류 결과
    body_type VARCHAR(20),  -- S/N/W
    s_score INT,
    n_score INT,
    w_score INT,
    confidence DECIMAL(3,2),
    
    created_at TIMESTAMP DEFAULT NOW(),
    
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at)
);

-- JSONB 쿼리 예시
SELECT 
    correlation_id,
    ai_response->'body_type_metrics'->>'shoulder_slope_angle' as shoulder_slope
FROM body_analysis_history
WHERE created_at > NOW() - INTERVAL '1 month';
```

**파일 관리**:
- `response_dump.json`: 최신 1개만 유지 (디버깅용)
- DB: 모든 기록 보관 (retention policy: 1년)

---

## 5. 구현 순서

### Day 1: AI Worker
1. ✅ `body_type_analyzer.py` 작성
2. ✅ `smplx_joints.py` 작성
3. ✅ `handler.py` 통합
4. ✅ 단위 테스트

### Day 2: Backend
1. ✅ DTO 클래스 추가
2. ✅ `BodyTypeClassifier` 서비스
3. ✅ DB 스키마 생성
4. ✅ 통합 테스트

### Day 3: 검증
1. ✅ 실제 이미지로 end-to-end 테스트
2. ✅ 지표 값 검증 (합리적인 범위인지)
3. ✅ 분류 결과 확인

---

## 6. 백엔드 Integration 예시

```java
@RabbitListener(queues = "body-worker.completed")
public void handleBodyAnalysis(BodyAnalysisResponse response) {
    String correlationId = response.getCorrelationId();
    
    if ("success".equals(response.getStatus())) {
        Result result = response.getResult();
        
        // 1. 분류 수행
        BodyTypeResult classification = bodyTypeClassifier
            .classify(result.getBodyTypeMetrics());
        
        // 2. DB 저장
        BodyAnalysisHistory history = BodyAnalysisHistory.builder()
            .correlationId(correlationId)
            .userId(getUserId(correlationId))
            .aiResponse(objectMapper.valueToTree(result))  // JSONB
            .bodyType(classification.getPrimaryType())
            .sScore(classification.getScores().get("S"))
            .nScore(classification.getScores().get("N"))
            .wScore(classification.getScores().get("W"))
            .confidence(classification.getConfidence())
            .build();
        
        repository.save(history);
        
        // 3. 클라이언트 알림
        notifyClient(correlationId, classification);
    }
}
```

---

## 참고 사항

### 지표 검증
초기 배포 후 실제 데이터로 임계값 조정 필요:
```sql
-- 지표 분포 확인
SELECT 
    percentile_cont(0.25) WITHIN GROUP (ORDER BY 
        (ai_response->'body_type_metrics'->>'shoulder_slope_angle')::float
    ) as p25,
    percentile_cont(0.50) WITHIN GROUP (ORDER BY 
        (ai_response->'body_type_metrics'->>'shoulder_slope_angle')::float
    ) as median,
    percentile_cont(0.75) WITHIN GROUP (ORDER BY 
        (ai_response->'body_type_metrics'->>'shoulder_slope_angle')::float
    ) as p75
FROM body_analysis_history;
```

### 향후 개선
- 사용자 피드백 수집 → 지표 가중치 학습
- ML 모델로 전환 (Random Forest, XGBoost 등)
- 추가 지표 실험 (팔 길이, 다리 길이 비율 등)

## 목표

Worker에서 **골격 타입 분류용 10개 지표**를 계산해서 백엔드에 전달. 전체 mesh 대신 비즈니스 로직에 필요한 측정값만 전송하여 효율화.

## 배경

**서비스**: TryMe - 골격 타입(Straight/Natural/Wave) 분류 → 옷 추천
**문제**: 현재 10,475개 vertices + 20,908개 faces 전송 → 백엔드 부담
**해결**: AI worker에서 10개 지표 계산 → 간결한 JSON만 전달

---

## 구현할 10가지 지표

### 1. Shoulder Slope Angle (deg)
- **정의**: `atan2(|y_shoulder - y_neck|, |x_shoulder - x_neck|)` 좌우 평균
- **분류**: S(0-8°), N(8-14°), W(14°+)
- **필요 데이터**: Neck, LShoulder, RShoulder joints

### 2. Shoulder Width Index
- **정의**: `SW / H` (어깨너비 / 키)
- **분류**: W(<0.225), S(0.225-0.255), N(>0.255)
- **필요 데이터**: LShoulder, RShoulder, 키

### 3. Hip Width Index
- **정의**: `HW / H` (골반너비 / 키)
- **분류**: S(0.225-0.255), N(0.235-0.265), W(>0.255)
- **필요 데이터**: LHip, RHip joints, 키

### 4. Shoulder-Hip Ratio
- **정의**: `SW / HW`
- **분류**: W(<0.95), S(0.95-1.05), N(>1.05)

### 5. Upper Body Depth Index
- **정의**: `Dchest / SW` (흉곽 두께 / 어깨너비)
- **분류**: W(<0.28), N(0.28-0.32), S(>0.32)
- **필요 데이터**: Chest area vertices (앞-뒤 최대 깊이)

### 6. Ribcage Volume Index
- **정의**: `Achest / H^2` (흉곽 단면적 / 키^2)
- **분류**: W(<0.030), N(0.030-0.036), S(>0.036)
- **필요 데이터**: Chest perimeter vertices

### 7. Waist Curvature Index
- **정의**: `(HW - WW) / HW` (허리 들어감 정도)
- **분류**: S(<0.14), N(0.14-0.22), W(>0.22)
- **필요 데이터**: Waist width, Hip width

### 8. Joint Thickness Index
- **정의**: `Rj / H` (평균 관절 반경 / 키)
- **분류**: W(<0.0105), S(0.0105-0.0125), N(>0.0125)
- **필요 데이터**: Wrist, Ankle vertices radius

### 9. Arm-Torso Ratio
- **정의**: `(Shoulder→Wrist) / (Neck→Pelvis)`
- **분류**: S(<0.98), W(0.98-1.05), N(>1.05)
- **필요 데이터**: Joints 거리

### 10. Linearity Index
- **정의**: 정면 실루엣 직선성 (직선 구간 / 전체 외곽선)
- **분류**: W(<0.62), N(0.62-0.70), S(>0.70)
- **필요 데이터**: Front projection outline

---

## 구현 계획

### 1. 새 모듈 추가: `shapy/body_type_analyzer.py`

```python
class BodyTypeAnalyzer:
    def __init__(self, vertices, joints, measurements):
        self.vertices = vertices
        self.joints = joints  # SMPL-X 127 joints
        self.height = measurements['height']
        
    def calculate_all_metrics(self) -> dict:
        return {
            'shoulder_slope_angle': self._calc_shoulder_slope(),
            'shoulder_width_index': self._calc_shoulder_width_idx(),
            'hip_width_index': self._calc_hip_width_idx(),
            'shoulder_hip_ratio': self._calc_sh_ratio(),
            'upper_body_depth_index': self._calc_upper_depth_idx(),
            'ribcage_volume_index': self._calc_ribcage_vol_idx(),
            'waist_curvature_index': self._calc_waist_curve_idx(),
            'joint_thickness_index': self._calc_joint_thick_idx(),
            'arm_torso_ratio': self._calc_arm_torso_ratio(),
            'linearity_index': self._calc_linearity_idx()
        }
```

### 2. `handler.py` 수정

```python
# Shapy inference 후
result = shapy_runner.run(...)

# Body type analysis 추가
from shapy.body_type_analyzer import BodyTypeAnalyzer
analyzer = BodyTypeAnalyzer(
    vertices=result['stage_02']['vertices'],
    joints=result['stage_02']['joints'],
    measurements=result['measurements']
)
body_type_metrics = analyzer.calculate_all_metrics()

# Response에 추가
response = {
    'correlation_id': correlation_id,
    'status': 'success',
    'result': {
        'body_type_metrics': body_type_metrics,  # ← 핵심!
        'measurements': result['measurements'],   # 기본 측정값
        # vertices, faces는 optional (시각화 필요시)
    }
}
```

### 3. Response 구조 변경

**Before** (현재):
```json
{
  "result": {
    "vertices": [[...10,475개...]],
    "faces": [[...20,908개...]],
    ...
  }
}
```

**After** (개선):
```json
{
  "result": {
    "body_type_metrics": {
      "shoulder_slope_angle": 12.5,
      "shoulder_width_index": 0.240,
      "hip_width_index": 0.248,
      "shoulder_hip_ratio": 0.97,
      "upper_body_depth_index": 0.29,
      "ribcage_volume_index": 0.033,
      "waist_curvature_index": 0.18,
      "joint_thickness_index": 0.0115,
      "arm_torso_ratio": 1.02,
      "linearity_index": 0.65
    },
    "measurements": {
      "height": [1.713],
      "chest": [1.031],
      ...
    }
  }
}
```

---

## SMPL-X Joint Mapping

필요한 주요 관절 인덱스:
```python
JOINT_NAMES = {
    'pelvis': 0,
    'left_hip': 1,
    'right_hip': 2,
    'spine1': 3,
    'left_knee': 4,
    'right_knee': 5,
    'spine2': 6,
    'left_ankle': 7,
    'right_ankle': 8,
    'spine3': 9,
    'neck': 12,
    'left_collar': 13,
    'right_collar': 14,
    'head': 15,
    'left_shoulder': 16,
    'right_shoulder': 17,
    'left_elbow': 18,
    'right_elbow': 19,
    'left_wrist': 20,
    'right_wrist': 21,
}
```

---

## 백엔드 사용 예시

```java
@Data
public class BodyTypeMetrics {
    @JsonProperty("shoulder_slope_angle")
    private double shoulderSlopeAngle;
    
    @JsonProperty("shoulder_width_index")
    private double shoulderWidthIndex;
    
    // ... 나머지 8개
}

// 점수 계산
public Map<String, Integer> calculateScore(BodyTypeMetrics metrics) {
    int sScore = 0, nScore = 0, wScore = 0;
    
    // 1. Shoulder Slope
    if (metrics.getShoulderSlopeAngle() < 8) sScore++;
    else if (metrics.getShoulderSlopeAngle() < 14) nScore++;
    else wScore++;
    
    // 2~10. 나머지 지표들...
    
    return Map.of("S", sScore, "N", nScore, "W", wScore);
}
```

---

## 개선 제안

### 추가 고려사항

1. **3D 정확도 향상**:
   - 현재 로직의 "앞-뒤 깊이"는 2D projection으로 부정확할 수 있음
   - SMPL-X mesh는 3D이므로 실제 3D 거리 사용 가능
   
2. **더 나은 지표**:
   - **Shoulder Width**: 단순 좌우 거리 대신 clavicle bone length 사용?
   - **Ribcage Volume**: 단면적 대신 실제 부피 계산?
   
3. **머신러닝 접근**:
   - 10개 지표 hand-crafted 대신 학습 기반 분류기?
   - 라벨된 데이터 있으면 더 정확할 수 있음

---

## 파일 구조

```
ai/
├── shapy/
│   ├── body_type_analyzer.py  [NEW] - 10개 지표 계산 로직
│   └── runner.py              [수정] - analyzer 통합
├── workers/
│   └── body-worker/
│       └── worker/
│           └── handlers/
│               └── handler.py [수정] - body_type_metrics 추가
└── tests/
    └── test_body_type_analyzer.py [NEW] - 단위 테스트
```

---

## 다음 단계

1. ✅ 계획 검토 및 승인
2. `body_type_analyzer.py` 구현
3. `handler.py` 통합
4. 테스트 및 검증
5. 백엔드 DTO 업데이트
