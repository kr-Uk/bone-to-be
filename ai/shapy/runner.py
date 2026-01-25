import torch
import numpy as np
import cv2

# model_loader ensures 'shapy' is in sys.path
from preprocess_image import preprocess_image
from model_loader import load_shapy_singleton


# =========================================================
# SHAPY Runner
# =========================================================
class ShapyRunner:

    def __init__(self, device: str = "cuda"):
        loader = load_shapy_singleton(device=device)
        self.device = loader.device
        self.model = loader.model

    @torch.no_grad()
    def run(
        self,
        image_bgr: np.ndarray,
        yolo_keypoints: np.ndarray,
    ):
        """
        image_bgr : (H, W, 3)
        yolo_keypoints: (17, 3) [x, y, conf]
        """

        # 1️⃣ YOLO → Body25
        body25 = self.yolo_to_openpose_body25(yolo_keypoints)

        # 2️⃣ Preprocess (Crop, Normalize, Target creation)
        # Returns tensors on the correct device
        body_imgs, body_targets = preprocess_image(
            image_bgr, 
            body25, 
            device=self.device
        )

        # 3️⃣ Forward Pass
        output = self.model(
            body_imgs,
            body_targets,
            full_imgs=None,
            device=self.device
        )

        return output

    @staticmethod
    def yolo_to_openpose_body25(yolo_kps: np.ndarray) -> np.ndarray:
        """
        yolo_kps: (17, 3)  [x, y, conf]  (pixel 기준)
        return:  (25, 3)
        """
        op = np.zeros((25, 3), dtype=np.float32)

        # ---------- direct mapping ----------
        op[0]  = yolo_kps[0]    # Nose
        op[2]  = yolo_kps[6]    # R shoulder
        op[3]  = yolo_kps[8]    # R elbow
        op[4]  = yolo_kps[10]   # R wrist
        op[5]  = yolo_kps[5]    # L shoulder
        op[6]  = yolo_kps[7]    # L elbow
        op[7]  = yolo_kps[9]    # L wrist

        op[9]  = yolo_kps[12]   # R hip
        op[10] = yolo_kps[14]   # R knee
        op[11] = yolo_kps[16]   # R ankle
        op[12] = yolo_kps[11]   # L hip
        op[13] = yolo_kps[13]   # L knee
        op[14] = yolo_kps[15]   # L ankle

        op[15] = yolo_kps[2]    # R eye
        op[16] = yolo_kps[1]    # L eye
        op[17] = yolo_kps[4]    # R ear
        op[18] = yolo_kps[3]    # L ear

        # ---------- derived joints ----------
        # Neck (Avg of Shoulders)
        if yolo_kps[5, 2] > 0 and yolo_kps[6, 2] > 0:
            op[1] = (yolo_kps[5] + yolo_kps[6]) / 2.0

        # MidHip (Avg of Hips)
        if yolo_kps[11, 2] > 0 and yolo_kps[12, 2] > 0:
            op[8] = (yolo_kps[11] + yolo_kps[12]) / 2.0

        return op
