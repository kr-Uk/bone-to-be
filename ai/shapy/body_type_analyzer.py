"""
Body Type Analyzer - 골격 진단을 위한 11개 지표 계산

SMPL-X mesh와 joints를 분석하여 체형 특징을 정량화합니다.
"""

import numpy as np
from typing import Dict, Optional
from smplx_joints import JOINT_INDICES


class BodyTypeAnalyzer:
    """11개 body type 지표 계산기"""
    
    def __init__(self, vertices: np.ndarray, joints: np.ndarray, 
                 measurements: Dict[str, tuple], height: Optional[float] = None):
        """
        Args:
            vertices: (N, 3) SMPL-X mesh vertices
            joints: (144, 3) SMPL-X joint positions
            measurements: {'chest': (value, 'm'), 'waist': (...), 'hips': (...)}
            height: 키 (meters), optional
        """
        # Tensor to numpy conversion if needed
        if hasattr(vertices, 'detach'):  # PyTorch tensor
            import torch
            if torch.is_tensor(vertices):
                vertices = vertices.detach().cpu().numpy()
            if torch.is_tensor(joints):
                joints = joints.detach().cpu().numpy()
        
        # Remove batch dimension if present
        if len(vertices.shape) == 3:
            vertices = vertices[0]
        if len(joints.shape) == 3:
            joints = joints[0]
            
        self.vertices = vertices
        self.joints = joints
        self.height = height
        self.chest = measurements['chest'][0]
        self.waist = measurements['waist'][0]
        self.hips = measurements['hips'][0]
    
    def calculate_all_metrics(self) -> Dict[str, float]:
        """11개 지표 모두 계산 (다리 길이 추가)"""
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
            'linearity_index': self._linearity_idx(),
            'leg_length_index': self._leg_length_idx()
        }
    
    def _shoulder_slope(self) -> float:
        """1. 어깨 기울기 각도 (degree)"""
        l_shoulder = self.joints[JOINT_INDICES['left_shoulder']]
        r_shoulder = self.joints[JOINT_INDICES['right_shoulder']]
        
        dx = abs(r_shoulder[0] - l_shoulder[0])
        dy = abs(r_shoulder[1] - l_shoulder[1])
        
        angle_rad = np.arctan2(dy, dx)
        return float(np.degrees(angle_rad))
    
    def _shoulder_width_idx(self) -> float:
        """2. 어깨 너비 / 키"""
        l_shoulder = self.joints[JOINT_INDICES['left_shoulder']]
        r_shoulder = self.joints[JOINT_INDICES['right_shoulder']]
        shoulder_width = np.linalg.norm(r_shoulder - l_shoulder)
        
        if self.height is not None and self.height > 0:
            return float(shoulder_width / self.height)
        else:
            head = self.joints[JOINT_INDICES['head']]
            pelvis = self.joints[JOINT_INDICES['pelvis']]
            approx_height = abs(head[1] - pelvis[1]) * 1.5
            return float(shoulder_width / approx_height) if approx_height > 0 else 0.25
    
    def _hip_width_idx(self) -> float:
        """3. 골반 너비 / 키"""
        l_hip = self.joints[JOINT_INDICES['left_hip']]
        r_hip = self.joints[JOINT_INDICES['right_hip']]
        hip_width = np.linalg.norm(r_hip - l_hip)
        
        if self.height is not None and self.height > 0:
            return float(hip_width / self.height)
        else:
            head = self.joints[JOINT_INDICES['head']]
            pelvis = self.joints[JOINT_INDICES['pelvis']]
            approx_height = abs(head[1] - pelvis[1]) * 1.5
            return float(hip_width / approx_height) if approx_height > 0 else 0.20
    
    def _shoulder_hip_ratio(self) -> float:
        """4. 어깨 너비 / 골반 너비"""
        l_shoulder = self.joints[JOINT_INDICES['left_shoulder']]
        r_shoulder = self.joints[JOINT_INDICES['right_shoulder']]
        l_hip = self.joints[JOINT_INDICES['left_hip']]
        r_hip = self.joints[JOINT_INDICES['right_hip']]
        
        shoulder_width = np.linalg.norm(r_shoulder - l_shoulder)
        hip_width = np.linalg.norm(r_hip - l_hip)
        
        return float(shoulder_width / hip_width) if hip_width > 0 else 1.0
    
    def _upper_depth_idx(self) -> float:
        """5. 상체 깊이 / 키 (흉곽 두께)"""
        chest_verts = self.vertices[self.vertices[:, 1] > self.joints[JOINT_INDICES['pelvis']][1]]
        if len(chest_verts) == 0:
            return 0.18
        
        depth = chest_verts[:, 2].max() - chest_verts[:, 2].min()
        
        if self.height is not None and self.height > 0:
            return float(depth / self.height)
        else:
            head = self.joints[JOINT_INDICES['head']]
            pelvis = self.joints[JOINT_INDICES['pelvis']]
            approx_height = abs(head[1] - pelvis[1]) * 1.5
            return float(depth / approx_height) if approx_height > 0 else 0.18
    
    def _ribcage_volume_idx(self) -> float:
        """6. 흉곽 부피 / 허리 비율"""
        if self.waist > 0:
            return float(self.chest / self.waist)
        return 1.0
    
    def _waist_curvature_idx(self) -> float:
        """7. 허리 곡선 정도 (hip-waist, chest-waist의 평균 차이)"""
        chest_diff = self.chest - self.waist
        hip_diff = self.hips - self.waist
        avg_curve = (chest_diff + hip_diff) / 2.0
        
        if self.height is not None and self.height > 0:
            return float(avg_curve / self.height)
        return float(avg_curve / 1.65)
    
    def _joint_thickness_idx(self) -> float:
        """8. 관절 굵기 (손목/발목 평균)"""
        def get_radius(joint_pos, vertices, threshold=0.05):
            distances = np.linalg.norm(vertices - joint_pos, axis=1)
            nearby = vertices[distances < threshold]
            if len(nearby) > 0:
                return nearby[:, 0].max() - nearby[:, 0].min()
            return 0.05
        
        l_wrist = self.joints[JOINT_INDICES['left_wrist']]
        r_wrist = self.joints[JOINT_INDICES['right_wrist']]
        l_ankle = self.joints[JOINT_INDICES['left_ankle']]
        r_ankle = self.joints[JOINT_INDICES['right_ankle']]
        
        l_wrist_r = get_radius(l_wrist, self.vertices)
        r_ankle_r = get_radius(l_ankle, self.vertices)
        avg_radius = (l_wrist_r + r_ankle_r) / 2
        
        if self.height is not None and self.height > 0:
            return float(avg_radius / self.height)
        return float(avg_radius / 1.65)
    
    def _arm_torso_ratio(self) -> float:
        """9. 팔 길이 / 상체 길이"""
        l_shoulder = self.joints[JOINT_INDICES['left_shoulder']]
        l_wrist = self.joints[JOINT_INDICES['left_wrist']]
        pelvis = self.joints[JOINT_INDICES['pelvis']]
        
        arm_length = np.linalg.norm(l_wrist - l_shoulder)
        torso_length = np.linalg.norm(l_shoulder - pelvis)
        
        return float(arm_length / torso_length) if torso_length > 0 else 0.7
    
    def _linearity_idx(self) -> float:
        """10. 체형 직선성 (0~1, 1에 가까울수록 직선)"""
        # 실루엣 외곽선 추출 (상체 중심)
        pelvis_y = self.joints[JOINT_INDICES['pelvis']][1]
        neck_y = self.joints[JOINT_INDICES['neck']][1]
        torso_verts = self.vertices[(self.vertices[:, 1] >= pelvis_y) & 
                                     (self.vertices[:, 1] <= neck_y)]
        
        if len(torso_verts) < 10:
            return 0.85
        
        # 좌우 외곽선
        left_outline = torso_verts[torso_verts[:, 0] < 0]
        right_outline = torso_verts[torso_verts[:, 0] > 0]
        
        outline_points = np.vstack([
            left_outline[left_outline[:, 0].argsort()[-10:]],
            right_outline[right_outline[:, 0].argsort()[:10]]
        ])
        
        # 직선성 계산 (각도 변화가 작을수록 직선)
        total_length = 0
        straight_length = 0
        
        for i in range(len(outline_points) - 1):
            segment_len = np.linalg.norm(outline_points[i+1] - outline_points[i])
            total_length += segment_len
            
            if i > 0 and i < len(outline_points) - 1:
                p1 = outline_points[i-1]
                p2 = outline_points[i]
                p3 = outline_points[(i + 2) % len(outline_points)]
                v1 = p2 - p1
                v2 = p3 - p2
                angle = np.arccos(np.dot(v1, v2) / 
                                 (np.linalg.norm(v1) * np.linalg.norm(v2) + 1e-8))
                if abs(angle) < np.radians(15):
                    straight_length += segment_len
        
        return straight_length / total_length if total_length > 0 else 0.85
    
    def _leg_length_idx(self) -> float:
        """
        11. 다리 길이 지수 (Leg Length Index)
        
        Hip에서 Ankle까지의 Y축 거리 (높이 차이)
        Pose에 독립적 - 무릎 굽힘 여부와 무관
        
        Returns:
            다리 길이 / 키 비율 (0~1)
        """
        # Pelvis (중앙 hip) Y 좌표
        pelvis_y = self.joints[JOINT_INDICES['pelvis']][1]
        
        # 양쪽 발목 평균 Y 좌표
        l_ankle_y = self.joints[JOINT_INDICES['left_ankle']][1]
        r_ankle_y = self.joints[JOINT_INDICES['right_ankle']][1]
        avg_ankle_y = (l_ankle_y + r_ankle_y) / 2.0
        
        # 다리 길이 (Y축 거리)
        leg_length = abs(pelvis_y - avg_ankle_y)
        
        # 키로 정규화
        if self.height is not None and self.height > 0:
            leg_ratio = leg_length / self.height
        else:
            # 키 정보 없으면 전체 신체 높이로 대체
            head_y = self.joints[JOINT_INDICES['head']][1]
            body_height = abs(head_y - avg_ankle_y)
            leg_ratio = leg_length / body_height if body_height > 0 else 0.5
        
        return float(leg_ratio)
