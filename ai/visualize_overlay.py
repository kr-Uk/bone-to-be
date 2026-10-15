import sys
import os
import json
import numpy as np
import cv2
import torch
import requests
import trimesh
import pyrender
from collections import defaultdict
from ultralytics import YOLO

# Add shapy path
current_dir = os.path.dirname(os.path.abspath(__file__))
shapy_dir = os.path.join(current_dir, "shapy")
sys.path.insert(0, shapy_dir)

from preprocess_image import preprocess_image, CROP_SIZE, MEAN, STD
from regressor.human_shape.data.utils.bbox import bbox_to_center_scale, keyps_to_bbox

# Import OverlayRenderer from shapy
try:
    from regressor.human_shape.utils.plot_utils import OverlayRenderer, COLORS
except ImportError:
    print("Error: Could not import OverlayRenderer. Make sure dependencies are installed.")
    sys.exit(1)

def download_image(url):
    resp = requests.get(url, stream=True)
    resp.raise_for_status()
    arr = np.asarray(bytearray(resp.content), dtype=np.uint8)
    img = cv2.imdecode(arr, cv2.IMREAD_COLOR)
    return img

def weak_persp_to_blender(
        target,
        camera_scale,
        camera_transl,
        H, W,
        sensor_width=36,
        focal_length=5000):
    ''' Converts weak-perspective camera to a perspective camera
    '''
    # Extract bbox info from target dict
    orig_bbox_size = target['orig_bbox_size']
    bbox_center = target['orig_center']
    
    # Ensure inputs are treated as scalars if they are single-element arrays
    if isinstance(camera_scale, (np.ndarray, list)):
        camera_scale = float(camera_scale)
    if isinstance(orig_bbox_size, (np.ndarray, list)):
        orig_bbox_size = float(orig_bbox_size)
    
    z = 2 * focal_length / (camera_scale * orig_bbox_size)
    
    # Ensure components are scalars
    tx = float(camera_transl[0])
    ty = float(camera_transl[1])
    tz = float(z)

    transl = [tx, ty, tz]
    shift_x = - (bbox_center[0] / W - 0.5)
    shift_y = (bbox_center[1] - 0.5 * H) / W
    focal_length_in_mm = focal_length / W * sensor_width
    
    output = {}
    output['shift_x'] = shift_x
    output['shift_y'] = shift_y
    output['transl'] = np.array(transl)
    output['focal_length_in_mm'] = focal_length_in_mm
    output['focal_length_in_px'] = focal_length
    output['center'] = np.array(bbox_center)
    output['sensor_width'] = sensor_width
    return output

def main():
    json_path = "response_dump.json"
    if not os.path.exists(json_path):
        print("response_dump.json not found.")
        return

    with open(json_path, 'r') as f:
        data = json.load(f)

    result = data.get("result", {})
    image_url = os.environ.get("IMAGE_URL") or data.get("request", {}).get("image_url")
    
    if not image_url:
        print("No image_url found. Set IMAGE_URL or include request.image_url in response_dump.json.")
        return

    # 1. Load Image
    print("Downloading input image...")
    orig_img = download_image(image_url)
    H, W = orig_img.shape[:2]
    print(f"📐 Original image size: {W}x{H} (width x height)")

    # 2. Get BBox Info from Worker Output (Not from YOLO!)
    # The worker already computed bbox using Body25 keypoints
    # We MUST use the same bbox params for visualization
    bbox_meta = result.get("bbox_metadata")
    
    if not bbox_meta:
        print("❌ ERROR: No bbox_metadata in worker output!")
        print("Worker must be updated to include bbox_metadata.")
        print("Falling back to YOLO-based bbox calculation (may be incorrect)...")
        
        # Fallback: Run YOLO to get bbox (less accurate)
        print("Running YOLO fallback...")
        yolo_model = YOLO('yolo11m-pose.pt')
        results = yolo_model(orig_img, verbose=False, classes=[0], conf=0.5)
        if not results or not results[0].keypoints:
            print("YOLO failed to detect person.")
            return
            
        keypoints = results[0].keypoints.data[0].cpu().numpy() # (17, 3)
        
        # Convert to Body25 for bbox calculation
        # Import the conversion function from workers directory
        import sys
        workers_utils_path = os.path.join(os.path.dirname(__file__), 'workers', 'body-worker', 'worker')
        if workers_utils_path not in sys.path:
            sys.path.insert(0, workers_utils_path)
        from utils.yolo_converter import yolo_to_openpose_body25
        body25_kps = yolo_to_openpose_body25(keypoints)
       
        # Filter keypoints < 0.1
        body_thresh = 0.1
        low_conf_mask = body25_kps[:, 2] < body_thresh
        body25_kps[low_conf_mask, :] = 0.0
        
        kps_2d = body25_kps[:, :2]
        conf = body25_kps[:, 2]
        
        bbox_xyxy = keyps_to_bbox(kps_2d, conf, img_size=(H, W, 3))
        center, scale, bbox_size = bbox_to_center_scale(bbox_xyxy, dset_scale_factor=1.2)
    else:
        # Use worker's bbox metadata (CORRECT!)
        print(f"✅ Using bbox_metadata from worker output")
        center = np.array(bbox_meta['center'])
        scale = bbox_meta['scale']
        bbox_size = bbox_meta['bbox_size']
    
    print(f"BBox Size: {bbox_size}, Center: {center}")
    
    # Construct target dict for weak_persp_to_blender
    target_info = {
        'orig_bbox_size': bbox_size,
        'orig_center': center
    }

    # 3. Get Model Output
    stage_key = "stage_02"
    if stage_key not in result:
        print(f"Stage {stage_key} not found.")
        return
    vertices = np.array(result[stage_key]["vertices"])[0]
    faces = np.array(result[stage_key]["faces"])
    cam_params = result[stage_key].get("camera_parameters", {}) or result.get("camera_parameters", {})
    
    if not cam_params:
        print("No camera parameters found.")
        return
        
    cam_scale = np.array(cam_params['scale'])[0]       # (1,)
    cam_trans = np.array(cam_params['translation'])[0] # (3,)

    # 4. Convert Weak Perspective to Blender Camera
    hd_params = weak_persp_to_blender(
        target_info,
        camera_scale=cam_scale,
        camera_transl=cam_trans,
        H=H, W=W
    )

    # 5. Render using OverlayRenderer
    renderer = OverlayRenderer(img_size=max(H, W))
    
    # OverlayRenderer expects [Batch, H, W, 3] for bg_imgs in format (BS, H, W, C)
    # But usually it wants C, H, W?
    # Checked demo.py: bg_hd_imgs = np.transpose(hd_imgs, [0, 3, 1, 2]) -> (B, C, H, W)
    # BUT wait, demo.py calls hd_renderer(..., bg_imgs=bg_hd_imgs, ...)
    # Let's check OverlayRenderer call signature.
    # It takes bg_imgs.
    # If using OverlayRenderer class from plot_utils:
    # It updates camera with scale/trans directly!
    # "def update_camera(self, scale, translation, scale_first=False):"
    
    # WAIT! `OverlayRenderer` uses `WeakPerspectiveCamera`.
    # `HDRenderer` uses `IntrinsicsCamera`.
    # `demo.py` uses `HDRenderer` for the high-res overlay!
    # It explicitly imports `HDRenderer`.
    
    # If I use `OverlayRenderer`, it expects cropped params?
    # `demo.py` uses `hd_renderer` (which is HDRenderer) with `hd_params` (converted).
    # THIS IS THE KEY. `OverlayRenderer` is for Crop. `HDRenderer` is for Full Image.
    
    from regressor.human_shape.utils.plot_utils import HDRenderer
    hd_renderer = HDRenderer()
    
    # Prepare BG image (Needs to be N, C, H, W float 0-1)
    bg_img_norm = orig_img.astype(np.float32) / 255.0
    # RGB
    bg_img_norm = cv2.cvtColor(bg_img_norm, cv2.COLOR_BGR2RGB)
    bg_img_tensor = np.transpose(bg_img_norm, (2, 0, 1))[None] # (1, 3, H, W)
    
    # Render
    # vertices: (N, V, 3)
    vertices_batch = vertices[None]
    
    # Ensure inputs are arrays/lists for batch indexing
    fl_batch = [hd_params['focal_length_in_px']]
    
    overlays = hd_renderer(
        vertices_batch, faces,
        focal_length=fl_batch,
        camera_translation=hd_params['transl'][None], # Batchify
        camera_center=hd_params['center'][None],      # Batchify
        bg_imgs=bg_img_tensor,
        return_with_alpha=True,
        body_color=COLORS['default']
    )
    
    # Result is (B, 4, H, W)?
    # demo.py: out_img[key] = np.transpose(..., [0, 2, 3, 1])
    # plot_utils return: np.stack(output_imgs, axis=0)
    # output_imgs append: (C, H, W) clipped
    
    # So overlays is (1, 4, H, W)
    final_img = np.transpose(overlays[0], (1, 2, 0)) # (H, W, 4)
    final_img = (final_img * 255).astype(np.uint8)
    
    # Convert RGB to BGR for saving
    final_bgr = cv2.cvtColor(final_img, cv2.COLOR_RGBA2BGRA)
    
    cv2.imwrite("visualization_overlay.png", final_bgr)
    print("✅ Saved visualization_overlay.png")

if __name__ == "__main__":
    main()
