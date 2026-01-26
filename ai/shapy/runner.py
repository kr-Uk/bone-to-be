import torch
import numpy as np
import cv2

# model_loader ensures 'shapy' is in sys.path
from preprocess_image import preprocess_image
from model_loader import load_shapy_singleton
from regressor.human_shape.data.structures.image_list import to_image_list


# =========================================================
# SHAPY Runner
# =========================================================
class ShapyRunner:

    def __init__(self, device: str = "cuda", exp_opts: list = None):
        """
        Initialize ShapyRunner with specified device and optional config overrides.
        
        Args:
            device: 'cuda' or 'cpu'
            exp_opts: List of config overrides (e.g., ['part_key=pose', 'datasets.batch_size=1'])
        """
        loader = load_shapy_singleton(device=device, exp_opts=exp_opts)
        self.device = loader.device
        self.model = loader.model

    @torch.no_grad()
    def run(
        self,
        image_bgr: np.ndarray,
        body25_keypoints: np.ndarray,
        gender: str = "neutral",
    ):
        """
        Run Shapy inference on an image with Body25 keypoints.
        
        Args:
            image_bgr: (H, W, 3) BGR image
            body25_keypoints: (25, 3) [x, y, conf] in Body25 format (already converted from YOLO)
            gender: Gender for the model ('male', 'female', or 'neutral')
        
        Returns:
            Model output dictionary
        """
        # Validate gender
        if gender not in ["male", "female", "neutral"]:
            print(f"⚠️ Warning: Invalid gender '{gender}', using 'neutral'")
            gender = "neutral"

        # 1️⃣ Preprocess (Crop, Normalize, Target creation)
        # Body25 keypoints are already in the correct format
        body_imgs, body_targets, full_imgs_list, bbox_metadata = preprocess_image(
            image_bgr, 
            body25_keypoints,  # Direct use, no conversion needed
            device=self.device
        )
        
        # Wrap full images
        full_imgs = to_image_list(full_imgs_list)
        if full_imgs is not None:
             full_imgs = full_imgs.to(device=self.device)

        # 2️⃣ Forward Pass
        # Note: Gender parameter is primarily used by attributes module
        # The base model uses 'neutral' by default, but we pass it for future use
        output = self.model(
            body_imgs,
            body_targets,
            full_imgs=full_imgs,
            device=self.device
        )

        # 3️⃣ Add bbox metadata to output for visualization
        if isinstance(output, dict):
            output['bbox_metadata'] = bbox_metadata
        
        return output

    @staticmethod
    def yolo_to_openpose_body25(yolo_kps: np.ndarray) -> np.ndarray:
        """
        Convert YOLO keypoints to OpenPose Body25 format.
        
        NOTE: This method is kept for backward compatibility.
        The worker now uses worker/utils/yolo_converter.py which has the same logic.
        
        yolo_kps: (17, 3)  [x, y, conf]  (pixel 기준)
        return:  (25, 3)
        """
        # (17, 3) 형태의 입력 가정
        op = np.zeros((25, 3), dtype=np.float32)
        
        # 1. 직접 매핑 가능한 관절들
        op[0] = yolo_kps[0]   # Nose
        op[2] = yolo_kps[6]   # RSh
        op[3] = yolo_kps[8]   # RElb
        op[4] = yolo_kps[10]  # RWri
        op[5] = yolo_kps[5]   # LSh
        op[6] = yolo_kps[7]   # LElb
        op[7] = yolo_kps[9]   # LWri
        op[9] = yolo_kps[12]  # RHip
        op[10] = yolo_kps[14] # RKnee
        op[11] = yolo_kps[16] # RAnk
        op[12] = yolo_kps[11] # LHip
        op[13] = yolo_kps[13] # LKnee
        op[14] = yolo_kps[15] # LAnk
        op[15] = yolo_kps[2]  # REye
        op[16] = yolo_kps[1]  # LEye
        op[17] = yolo_kps[4]  # REar
        op[18] = yolo_kps[3]  # LEar
        
        # 2. 계산이 필요한 관절들 (Neck, MidHip)
        # Neck = Average of Shoulders (LSh:5, RSh:6)
        if yolo_kps[5, 2] > 0 and yolo_kps[6, 2] > 0:
            op[1] = (yolo_kps[5] + yolo_kps[6]) / 2.0
        
        # MidHip = Average of Hips (LHip:11, RHip:12)
        if yolo_kps[11, 2] > 0 and yolo_kps[12, 2] > 0:
            op[8] = (yolo_kps[11] + yolo_kps[12]) / 2.0
            
        # 3. 발(Toe/Heel) 데이터는 YOLO에 없으므로 0.0 유지
        
        return op
