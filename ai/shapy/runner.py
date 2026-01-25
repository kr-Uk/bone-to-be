import torch
import numpy as np


# =========================================================
# YOLO (17) → OpenPose Body25 변환
# =========================================================
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
    # Neck
    if yolo_kps[5, 2] > 0 and yolo_kps[6, 2] > 0:
        op[1] = (yolo_kps[5] + yolo_kps[6]) / 2.0

    # MidHip
    if yolo_kps[11, 2] > 0 and yolo_kps[12, 2] > 0:
        op[8] = (yolo_kps[11] + yolo_kps[12]) / 2.0

    return op


# =========================================================
# SHAPY Runner
# =========================================================
class ShapyRunner:

    def __init__(self, device: str = "cuda"):
        from model_loader import load_shapy_singleton
        loader = load_shapy_singleton()
        self.device = loader.device
        self.model = loader.model

    @torch.no_grad()
    def run(
        self,
        image_height: int,
        image_width: int,
        yolo_keypoints: np.ndarray,
    ):
        """
        image_height: H
        image_width : W
        yolo_keypoints: (17,3)  [x,y,conf]  pixel 기준
        """

        # 1️⃣ YOLO → Body25
        body25 = yolo_to_openpose_body25(yolo_keypoints)

        # 2️⃣ SHAPY target
        targets = {
            "keypoints_2d": torch.tensor(
                body25,
                dtype=torch.float32
            ).unsqueeze(0).to(self.device),

            "img_size": torch.tensor(
                [[image_height, image_width]],
                dtype=torch.float32
            ).to(self.device),
        }

        # 3️⃣ forward
        output = self.model(
            body_imgs,
            body_targets,
            full_imgs=None,
            device=self.device
        )


        return output
