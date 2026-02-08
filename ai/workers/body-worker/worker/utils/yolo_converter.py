"""
YOLO to OpenPose Body25 Converter Utility

This module provides functions to convert YOLO11-Pose keypoints (COCO-17 format)
to OpenPose Body_25 format, matching the exact logic from temp/ai/shapy/regressor/gen_openpose_yolo11.py
"""
import numpy as np
from typing import Dict, List, Any


def yolo_to_openpose_body25(yolo_kps: np.ndarray) -> np.ndarray:
    """
    Convert YOLO(COCO-17) format to OpenPose(Body_25) format.
    
    YOLO Indices (17 keypoints):
    0:Nose, 1:LEye, 2:REye, 3:LEar, 4:REar, 
    5:LSh, 6:RSh, 7:LElb, 8:RElb, 9:LWri, 10:RWri, 
    11:LHip, 12:RHip, 13:LKnee, 14:RKnee, 15:LAnk, 16:RAnk
    
    OpenPose Body_25 Indices (25 keypoints):
    0:Nose, 1:Neck, 2:RSh, 3:RElb, 4:RWri, 5:LSh, 6:LElb, 7:LWri, 
    8:MidHip, 9:RHip, 10:RKnee, 11:RAnk, 12:LHip, 13:LKnee, 14:LAnk, 
    15:REye, 16:LEye, 17:REar, 18:LEar, 19:LBigToe, 20:LSmallToe, 21:LHeel, 
    22:RBigToe, 23:RSmallToe, 24:RHeel
    
    Args:
        yolo_kps: (17, 3) array [x, y, conf]
        
    Returns:
        op_kps: (25, 3) array [x, y, conf]
    """
    # Initialize output array
    op_kps = np.zeros((25, 3), dtype=np.float32)
    
    # 1. Direct mappings
    op_kps[0] = yolo_kps[0]   # Nose
    op_kps[2] = yolo_kps[6]   # RSh
    op_kps[3] = yolo_kps[8]   # RElb
    op_kps[4] = yolo_kps[10]  # RWri
    op_kps[5] = yolo_kps[5]   # LSh
    op_kps[6] = yolo_kps[7]   # LElb
    op_kps[7] = yolo_kps[9]   # LWri
    op_kps[9] = yolo_kps[12]  # RHip
    op_kps[10] = yolo_kps[14] # RKnee
    op_kps[11] = yolo_kps[16] # RAnk
    op_kps[12] = yolo_kps[11] # LHip
    op_kps[13] = yolo_kps[13] # LKnee
    op_kps[14] = yolo_kps[15] # LAnk
    op_kps[15] = yolo_kps[2]  # REye
    op_kps[16] = yolo_kps[1]  # LEye
    op_kps[17] = yolo_kps[4]  # REar
    op_kps[18] = yolo_kps[3]  # LEar
    
    # 2. Calculated joints (Neck, MidHip)
    # Neck = Average of Shoulders (LSh:5, RSh:6 in YOLO)
    if yolo_kps[5, 2] > 0 and yolo_kps[6, 2] > 0:
        op_kps[1] = (yolo_kps[5] + yolo_kps[6]) / 2.0
    
    # MidHip = Average of Hips (LHip:11, RHip:12 in YOLO)
    if yolo_kps[11, 2] > 0 and yolo_kps[12, 2] > 0:
        op_kps[8] = (yolo_kps[11] + yolo_kps[12]) / 2.0
        
    # 3. Toe/Heel data not available in YOLO, remain 0.0
    
    return op_kps


def create_openpose_json(yolo_kps: np.ndarray) -> Dict[str, Any]:
    """
    Create OpenPose standard JSON format from YOLO keypoints.
    
    This matches the exact format from temp/ai/shapy/regressor/gen_openpose_yolo11.py
    
    Args:
        yolo_kps: (17, 3) array [x, y, conf]
        
    Returns:
        Dictionary in OpenPose JSON format
    """
    # Convert YOLO to Body25
    body25_kps = yolo_to_openpose_body25(yolo_kps)
    
    # Flatten to 1D list [x1, y1, c1, x2, y2, c2, ...]
    pose_keypoints_2d = body25_kps.flatten().tolist()
    
    # Dummy data for face and hands (not available in YOLO)
    # Face: 70 points * 3 = 210
    face_keypoints_2d = [0.0] * 210
    # Hand: 21 points * 3 = 63
    hand_left_keypoints_2d = [0.0] * 63
    hand_right_keypoints_2d = [0.0] * 63
    
    return {
        "version": 1.3,
        "people": [
            {
                "person_id": [-1],
                "pose_keypoints_2d": pose_keypoints_2d,
                "face_keypoints_2d": face_keypoints_2d,
                "hand_left_keypoints_2d": hand_left_keypoints_2d,
                "hand_right_keypoints_2d": hand_right_keypoints_2d,
                "pose_keypoints_3d": [],
                "face_keypoints_3d": [],
                "hand_left_keypoints_3d": [],
                "hand_right_keypoints_3d": []
            }
        ]
    }


def parse_openpose_json(openpose_dict: Dict[str, Any]) -> np.ndarray:
    """
    Parse OpenPose JSON format back to Body25 (25, 3) array.
    
    Args:
        openpose_dict: Dictionary in OpenPose JSON format
        
    Returns:
        body25_kps: (25, 3) array [x, y, conf]
    """
    if not openpose_dict.get("people"):
        raise ValueError("No people detected in OpenPose JSON")
    
    # Get first person
    person = openpose_dict["people"][0]
    pose_keypoints_flat = person["pose_keypoints_2d"]
    
    # Reshape from flat list to (25, 3)
    body25_kps = np.array(pose_keypoints_flat, dtype=np.float32).reshape(25, 3)
    
    return body25_kps
