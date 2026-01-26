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


from regressor.human_shape.data.utils.bbox import bbox_to_center_scale, keyps_to_bbox

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
    
    Returns:
        body_imgs: preprocessed image tensor
        body_targets: list of HumanShapeTarget
        full_imgs_list: list of full image tensors
        bbox_metadata: dict with 'center', 'scale', 'bbox_size' for visualization
    """

    H, W = image_bgr.shape[:2]

    # -----------------------------------------------------
    # 1. bbox using Shapy Utils (Matches demo.py)
    # -----------------------------------------------------
    # -----------------------------------------------------
    # 0. Filter Keypoints (Match OpenPose Dataset)
    # -----------------------------------------------------
    body_thresh = 0.1
    print(f"[DEBUG] Original Body25 Kps (Conf>0): {(body25_kps[:, 2] > 0).sum()}")
    
    # Filter out low-confidence keypoints to match training/OpenPose dataset behavior
    low_conf_mask = body25_kps[:, 2] < body_thresh
    body25_kps[low_conf_mask] = 0.0
    
    print(f"[DEBUG] Filtered Body25 Kps (Conf>={body_thresh}): {(body25_kps[:, 2] > 0).sum()}")

    # keyps_to_bbox expects (N, 2) and (N,) conf
    kps_2d = body25_kps[:, :2]
    conf = body25_kps[:, 2]
    
    bbox_xyxy = keyps_to_bbox(kps_2d, conf, img_size=(H, W, 3))
    print(f"[DEBUG] Calculated BBox (xyxy): {bbox_xyxy}")
    
    # Standard Shapy OpenPose dataset uses dset_scale_factor=1.2
    center, scale, bbox_size = bbox_to_center_scale(bbox_xyxy, dset_scale_factor=1.2)
    print(f"[DEBUG] Center: {center}, Scale: {scale}, BBoxSize: {bbox_size}")
    
    # Note: Shapy 'scale' is bbox_size / 200.
    # But for creating the crop transform, we need the actual pixel size.
    # bbox_to_center_scale returns 'bbox_size' as the 3rd argument (pixels).
    # We use that for cropping.
    
    scale_pixels = bbox_size

    # -----------------------------------------------------
    # 2. crop
    # -----------------------------------------------------
    cx, cy = center
    
    src_pts = np.array([
        [cx - scale_pixels / 2, cy - scale_pixels / 2],
        [cx - scale_pixels / 2, cy + scale_pixels / 2],
        [cx + scale_pixels / 2, cy - scale_pixels / 2],
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
    crop = torch.tensor(crop, dtype=torch.float32).permute(2, 0, 1).unsqueeze(0)

    body_imgs = crop.to(device)

    # -----------------------------------------------------
    # 4. Transform Keypoints to Crop Coordinates
    # -----------------------------------------------------
    # CRITICAL: Model expects keypoints in CROP space (0-255), not original image space!
    # temp's dataset applies transforms that convert keypoints to crop coordinates
    # We must do the same here!
    
    # Apply affine transform to keypoints
    kps_original = body25_kps[:, :2].copy()  # (25, 2)
    conf = body25_kps[:, 2].copy()  # (25,)
    
    # Transform keypoints using same affine matrix
    # Add homogeneous coordinate
    kps_homogeneous = np.concatenate([kps_original, np.ones((25, 1))], axis=1)  # (25, 3)
    kps_cropped = (trans @ kps_homogeneous.T).T  # (25, 2)
    
    # Combine back with confidence
    body25_kps_cropped = np.concatenate([kps_cropped, conf[:, None]], axis=1)  # (25, 3)
    
    print(f"[DEBUG] Keypoints range - Original: x[{kps_original[:,0].min():.1f}, {kps_original[:,0].max():.1f}], Cropped: x[{kps_cropped[:,0].min():.1f}, {kps_cropped[:,0].max():.1f}]")

    # -----------------------------------------------------
    # 5. HumanShapeTarget
    # -----------------------------------------------------
    target = HumanShapeTarget(
        keypoints_2d=torch.tensor(body25_kps_cropped, dtype=torch.float32),  # ✅ Crop coordinates!
        center=torch.tensor([cx, cy], dtype=torch.float32),
        scale=torch.tensor(scale, dtype=torch.float32),
        image_size=torch.tensor([H, W], dtype=torch.float32),
    )

    # -----------------------------------------------------
    # 5. Full Image (Global Context)
    # -----------------------------------------------------
    # Demo.py uses 'return_full_imgs=True' in dataloader.
    # It normalizes the full image same as crops? 
    # Usually transforms apply to everything.
    # Let's verify standard normalization.
    
    full_img = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2RGB)
    full_img = full_img.astype(np.float32) / 255.0
    full_img = (full_img - MEAN) / STD
    full_img_tensor = torch.tensor(full_img, dtype=torch.float32).permute(2, 0, 1) # (3, H, W)
    
    # Return raw tensor (H, W are variable, handled by ImageList)
    full_imgs_list = [full_img_tensor.to(device)]
    
    body_targets = [target.to(device)]

    # Return bbox metadata for visualization
    bbox_metadata = {
        'center': center,  # (2,) numpy array
        'scale': scale,    # scalar
        'bbox_size': bbox_size  # scalar
    }

    return body_imgs, body_targets, full_imgs_list, bbox_metadata
