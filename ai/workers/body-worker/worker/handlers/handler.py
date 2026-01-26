import sys
import os
import cv2
import numpy as np
import torch
from ultralytics import YOLO
import requests

# ---------------------------------------------------------
# Path Setup for Shapy
# ---------------------------------------------------------
# Prioritize SHAPY_PATH env var (useful for Docker/Production)
SHAPY_DIR = os.getenv("SHAPY_PATH")
print(f"--------------------{SHAPY_DIR}---------------")
if not SHAPY_DIR:
    # Fallback to local relative path
    # Current: .../ai/workers/body-worker/worker/handlers/handler.py
    # Goal:    .../ai/shapy
    CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
    AI_ROOT = os.path.abspath(os.path.join(CURRENT_DIR, "..", "..", "..", ".."))
    SHAPY_DIR = os.path.join(AI_ROOT, "shapy")

if SHAPY_DIR not in sys.path:
    sys.path.insert(0, SHAPY_DIR)
    print(f"🔗 Added Shapy to path: {SHAPY_DIR}")

if os.path.isdir(SHAPY_DIR):
    print(f"📂 Changing working directory to: {SHAPY_DIR}")
    os.chdir(SHAPY_DIR)

# Add sub-modules that appear to be used as top-level imports in Shapy code
# e.g. "from body_measurements import ..." requires "mesh-mesh-intersection" in path
subdirs_to_add = [
    "measurements", 
    "attributes", 
    "preprocess",
    "mesh-mesh-intersection" 
]

for subdir in subdirs_to_add:
    p = os.path.join(SHAPY_DIR, subdir)
    if os.path.isdir(p) and p not in sys.path:
        sys.path.insert(0, p)
        print(f"🔗 Added Shapy submodule to path: {p}")

# Now we can import from shapy
try:
    from runner import ShapyRunner
except ImportError:
    print(f"❌ Error: Could not import runner from {SHAPY_DIR}")
    # Don't silence it, let it fail so logs show the issue
    raise


from worker.publisher import publish

# ---------------------------------------------------------
# Global Models (Singleton)
# ---------------------------------------------------------
print("⏳ Initializing models...")
try:
    # 1. YOLO
    # Using 'yolo11m-pose.pt' as per user's previous script
    yolo_model = YOLO('yolo11m-pose.pt') 
    
    # 2. Shapy
    device = 'cuda' if torch.cuda.is_available() else 'cpu'
    shapy_runner = ShapyRunner(device=device)
    
    print("✅ Models initialized successfully.")
except Exception as e:
    print(f"❌ Error initializing models: {e}")
    yolo_model = None
    shapy_runner = None

def handle(message: dict):
    print(f"Processing message: {message}")
    
    if yolo_model is None or shapy_runner is None:
        publish({
            "status": "ERROR",
            "error": "Models not initialized on worker",
            "request": message
        })
        return

    try:
        # Prioritize image_url for CDN usage
        image_url = message.get("image_url")
        image_path = message.get("image_path")
        
        img = None

        # 1. Load Image from URL (CDN)
        if image_url:
            print(f"🌐 Downloading image from {image_url}...")
            try:
                # Use a session for better connection handling
                with requests.Session() as session:
                    resp = session.get(image_url, timeout=15)
                    resp.raise_for_status() # Raise error for 4xx/5xx
                    
                    # Verify content type (basic check)
                    if 'image' not in resp.headers.get('Content-Type', ''):
                        print(f"⚠️ Warning: URL content-type is not image: {resp.headers.get('Content-Type')}")

                    arr = np.asarray(bytearray(resp.content), dtype=np.uint8)
                    img = cv2.imdecode(arr, -1)
                    
                    if img is None:
                        raise ValueError("Failed to decode image from URL data")

            except Exception as e:
                print(f"❌ Download failed: {e}")
                publish({
                    "status": "ERROR",
                    "message": f"Failed to download image from URL: {str(e)}",
                    "request": message
                })
                return

        # 2. Fallback to Local Path (for testing)
        elif image_path:
            print(f"📂 Loading local image: {image_path}")
            if os.path.exists(image_path):
                img = cv2.imread(image_path)
            else:
                print(f"❌ File not found: {image_path}")

        if img is None:
            publish({
                "status": "ERROR",
                "message": "No valid image found (provide 'image_url' or valid 'image_path')",
                "request": message
            })
            return

        # 2. YOLO Inference
        # classes=[0] usually person in COCO
        results = yolo_model(img, verbose=False, classes=[0], conf=0.5)
        
        if not results or not results[0].keypoints or results[0].keypoints.data.shape[1] == 0:
            publish({
                "status": "ERROR",
                "message": "No person detected or no keypoints found",
                "request": message
            })
            return

        # Take the first person detected
        # keypoints shape: (N, 17, 3) -> take [0] -> (17, 3)
        keypoints = results[0].keypoints.data[0].cpu().numpy()

        # 3. Shapy Inference
        output = shapy_runner.run(img, keypoints)

        # 4. Serialize Output
        # output is a dict of tensors. Convert to list.
        serialized_output = {}
        for k, v in output.items():
            if hasattr(v, 'detach'): # Tensor
                serialized_output[k] = v.detach().cpu().numpy().tolist()
            elif isinstance(v, np.ndarray):
                serialized_output[k] = v.tolist()
            else:
                serialized_output[k] = v

        # 5. Publish Result
        publish({
            "status": "COMPLETED",
            "result": serialized_output,
            "request": message
        })
        print("✅ Processing completed and published.")

    except Exception as e:
        import traceback
        traceback.print_exc()
        publish({
            "status": "ERROR",
            "error": str(e),
            "request": message
        })
