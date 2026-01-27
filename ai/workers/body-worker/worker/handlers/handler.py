import sys
import os
import cv2
import numpy as np
import torch
from ultralytics import YOLO
import requests

# YOLO to OpenPose converter (matching temp pipeline)
from worker.utils.yolo_converter import yolo_to_openpose_body25, create_openpose_json

# ---------------------------------------------------------
# Path Setup for Shapy
# ---------------------------------------------------------
# Prioritize SHAPY_PATH env var (useful for Docker/Production)
SHAPY_DIR = os.getenv("SHAPY_PATH")
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
    # Using 'yolo11x-pose.pt' to match temp pipeline (most accurate model)
    yolo_model = YOLO('yolo11x-pose.pt')
    
    # 2. Shapy
    device = 'cuda' if torch.cuda.is_available() else 'cpu'

    # [CRITICAL] Pass exp_opts to match temp's configuration exactly
    # These options MUST match temp/run_pipeline.py lines 61-68
    # IMPORTANT: Use ABSOLUTE path for checkpoint! Relative path fails from worker directory
    exp_opts = [
        # CORRECT ABSOLUTE PATH - checkpoint is in shapy/data, not ai/data
        'output_folder=/home/taekmin/S14P11D210/ai/shapy/data/trained_models/shapy/SHAPY_A',
        # Match temp's part_key (line 62)
        'part_key=pose',
        # Match temp's batch_size (line 67)
        'datasets.batch_size=1',
        # Match temp's pose_shape_ratio (line 68)
        'datasets.pose_shape_ratio=1.0'
    ]

    shapy_runner = ShapyRunner(device=device, exp_opts=exp_opts)
    
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
                    img = cv2.imdecode(arr, cv2.IMREAD_COLOR) # Force BGR (3 channels)
                    
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
        yolo_keypoints = results[0].keypoints.data[0].cpu().numpy()
        print(f"✅ YOLO detected {yolo_keypoints.shape[0]} keypoints")

        # 3. Convert YOLO to OpenPose Body25 format (matching temp/run_pipeline.py)
        # This is the CRITICAL step that temp does via gen_openpose_yolo11.py
        print(f"🔄 Converting YOLO → OpenPose Body25...")
        openpose_json = create_openpose_json(yolo_keypoints)

        # Parse back to (25, 3) array for Shapy
        body25_keypoints = np.array(
            openpose_json["people"][0]["pose_keypoints_2d"],
            dtype=np.float32
        ).reshape(25, 3)
        print(f"✅ Converted to Body25 format: {body25_keypoints.shape}")

        # 4. Get gender from message (optional, defaults to 'neutral')
        gender = message.get("gender", "neutral")
        if gender not in ["male", "female", "neutral"]:
            print(f"⚠️ Invalid gender '{gender}', defaulting to 'neutral'")
            gender = "neutral"
        print(f"👤 Using gender: {gender}")

        # 5. Shapy Inference (using Body25 keypoints like temp does)
        # [NEW] Get height from message
        height = message.get("height")
        print(f"📏 Using height: {height} m")

        print(f"🚀 Running Shapy inference...")
        output = shapy_runner.run(img, body25_keypoints, gender=gender, height=height)
        print(f"✅ Shapy inference completed")

        # 6. Body Type Analysis - Calculate 10 metrics
        print(f"📊 Calculating body type metrics...")
        from body_type_analyzer import BodyTypeAnalyzer
        
        try:
            analyzer = BodyTypeAnalyzer(
                vertices=output['stage_02']['vertices'][0],  # (10475, 3)
                joints=output['stage_02']['joints'][0],      # (127, 3)
                measurements=output['measurements']
            )
            body_type_metrics = analyzer.calculate_all_metrics()
            print(f"✅ Body type metrics calculated")
            
            # Add metrics to output
            output['body_type_metrics'] = body_type_metrics
        except Exception as e:
            print(f"⚠️ Warning: Body type analysis failed: {e}")
            # Continue without metrics if analysis fails
            output['body_type_metrics'] = None


        # 8. Serialize Output
        def make_serializable(obj):
            if isinstance(obj, dict) or str(type(obj)) == "<class 'collections.defaultdict'>":
                return {k: make_serializable(v) for k, v in obj.items() if v is not None}
            elif isinstance(obj, list):
                return [make_serializable(x) for x in obj]
            elif hasattr(obj, 'detach'):  # Tensor -> List
                return obj.detach().cpu().numpy().tolist()
            elif isinstance(obj, np.ndarray):  # Appears to be numpy array
                return obj.tolist()
            elif hasattr(obj, 'item'):  # Numpy scalar / Tensor scalar
                return obj.item()
            elif hasattr(obj, '_asdict'): # NamedTuple / specialized structs
                return make_serializable(obj._asdict())
            elif hasattr(obj, '__dict__'): # Generic objects
                return make_serializable(obj.__dict__)
            else:
                return obj
    

        # 9. Prepare minimal response for backend
        backend_result = {
            'body_type_metrics': output.get('body_type_metrics'),
            'measurements': {
                'chest': output.get('measurements', {}).get('chest'),
                'waist': output.get('measurements', {}).get('waist'),
                'hips': output.get('measurements', {}).get('hips')
            },
            'attributes': {
                'height': height,
                'gender': gender
            }
        }

        # 10. Publish Result (only essentials)
        publish({
            "status": "COMPLETED",
            "result": backend_result,
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
