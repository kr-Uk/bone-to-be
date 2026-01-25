import cv2
import torch
import numpy as np

from regressor.human_shape.data.structures.targets import HumanShapeTarget
from regressor.human_shape.data.structures.image_list import to_image_list


# ---------------------------------------------------------
# constants (demo.py 동일)
# ---------------------------------------------------------
CROP_SIZE = 256
MEAN = np.array([0.485, 0.456, 0.406])
STD  = np.array([0.229, 0.224, 0.225])


# ---------------------------------------------------------
# bbox from keypoints
# ---------------------------------------------------------
def compute_bbox_from_keypoints(kps, conf_thres=0.3):
    valid = kps[:, 2] > conf_thres
    pts = kps[valid][:, :2]

    x1 = np.min(pts[:, 0])
    y1 = np.min(pts[:, 1])
    x2 = np.max(pts[:, 0])
    y2 = np.max(pts[:, 1])

    return np.array([x1, y1, x2, y2])


# ---------------------------------------------------------
# main preprocess
# ---------------------------------------------------------
def preprocess_image(
    image_bgr: np.ndarray,
    body25_kps: np.ndarray,
    device: str = "cuda"
):
    """
    image_bgr : (H,W,3)
    body25_kps: (25,3)  pixel coord
    """

    H, W = image_bgr.shape[:2]

    # -----------------------------------------------------
    # 1. bbox
    # -----------------------------------------------------
    bbox = compute_bbox_from_keypoints(body25_kps)

    cx = (bbox[0] + bbox[2]) * 0.5
    cy = (bbox[1] + bbox[3]) * 0.5

    bw = bbox[2] - bbox[0]
    bh = bbox[3] - bbox[1]

    scale = max(bw, bh) * 1.2

    # -----------------------------------------------------
    # 2. crop
    # -----------------------------------------------------
    src_pts = np.array([
        [cx - scale / 2, cy - scale / 2],
        [cx - scale / 2, cy + scale / 2],
        [cx + scale / 2, cy - scale / 2],
    ], dtype=np.float32)

    dst_pts = np.array([
        [0, 0],
        [0, CROP_SIZE - 1],
        [CROP_SIZE - 1, 0],
    ], dtype=np.float32)

    trans = cv2.getAffineTransform(src_pts, dst_pts)

    crop = cv2.warpAffine(
        image_bgr,
        trans,
        (CROP_SIZE, CROP_SIZE),
        flags=cv2.INTER_LINEAR
    )

    crop = cv2.cvtColor(crop, cv2.COLOR_BGR2RGB)
    crop = crop.astype(np.float32) / 255.0

    # -----------------------------------------------------
    # 3. normalize
    # -----------------------------------------------------
    crop = (crop - MEAN) / STD
    crop = torch.tensor(crop).permute(2, 0, 1).unsqueeze(0)

    body_imgs = crop.to(device)

    # -----------------------------------------------------
    # 4. HumanShapeTarget
    # -----------------------------------------------------
    target = HumanShapeTarget(
        keypoints_2d=torch.tensor(body25_kps, dtype=torch.float32),
        center=torch.tensor([cx, cy], dtype=torch.float32),
        scale=torch.tensor(scale, dtype=torch.float32),
        image_size=torch.tensor([H, W], dtype=torch.float32),
    )

    body_targets = [target.to(device)]

    return body_imgs, body_targets
