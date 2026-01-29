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
            "report_id": message.get("reportId"),
            "status": "FAILED",
            "error": "Models not initialized on worker"
        })
        return

    try:
        # Extract backend message fields (backend sends camelCase)
        report_id = message.get("reportId")
        weight = message.get("weight")  # Integer (kg)
        height_cm = message.get("height")  # Integer (cm)
        gender = message.get("gender", "").lower()  # "male" or "female"
        presigned_url = message.get("presignedUrl")
        
        # Validate required fields
        if not presigned_url:
            publish({
                "report_id": report_id,
                "status": "FAILED",
                "error": "Missing required field: presignedUrl"
            })
            return
        
        if not height_cm or height_cm <= 0:
            publish({
                "report_id": report_id,
                "status": "FAILED",
                "error": "Missing or invalid required field: height (must be > 0)"
            })
            return
        
        # Convert height from cm to meters for Shapy
        height = height_cm / 100.0
        
        print(f"📊 Processing report {report_id}: height={height}m, weight={weight}kg, gender={gender}")
        
        img = None

        # 1. Load Image from presigned URL
        print(f"🌐 Downloading image from presigned URL...")
        try:
            # Use a session for better connection handling
            with requests.Session() as session:
                resp = session.get(presigned_url, timeout=15)
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
                "report_id": report_id,
                "status": "FAILED",
                "error": f"Failed to download image from presignedUrl: {str(e)}"
            })
            return

        if img is None:
            publish({
                "report_id": report_id,
                "status": "FAILED",
                "error": "Failed to load image from presignedUrl"
            })
            return

        # 2. YOLO Inference
        # classes=[0] usually person in COCO
        results = yolo_model(img, verbose=False, classes=[0], conf=0.5)
        
        if not results or not results[0].keypoints or results[0].keypoints.data.shape[1] == 0:
            publish({
                "report_id": report_id,
                "status": "FAILED",
                "error": "No person detected or no keypoints found"
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

        # 4. Shapy Inference (using Body25 keypoints)
        print(f"🚀 Running Shapy inference...")
        output = shapy_runner.run(img, body25_keypoints, gender=gender, height=height)
        print(f"✅ Shapy inference completed")
        
        # DEBUG: Check Shapy output
        vertices = output['stage_02']['vertices'][0]
        joints = output['stage_02']['joints'][0]
        measurements = output['measurements']
        print(f"🔍 DEBUG - Shapy output: vertices_mean={vertices.mean():.4f}, joints[0]={joints[0]}, chest={measurements['chest'][0]:.4f}, waist={measurements['waist'][0]:.4f}")

        # 5. Body Type Analysis - Calculate 11 metrics
        print(f"📊 Calculating body type metrics...")
        from body_type_analyzer import BodyTypeAnalyzer
        from smplx_joints import JOINT_INDICES
        
        try:
            analyzer = BodyTypeAnalyzer(
                vertices=output['stage_02']['vertices'][0],  # (10475, 3)
                joints=output['stage_02']['joints'][0],      # (127, 3)
                measurements=output['measurements'],
                height=height  # Pass height for accurate calculations
            )
            
            # DEBUG: Log analyzer inputs
            l_shoulder = analyzer.joints[JOINT_INDICES['left_shoulder']]
            r_shoulder = analyzer.joints[JOINT_INDICES['right_shoulder']]
            print(f"🔍 DEBUG - Analyzer inputs: l_shoulder={l_shoulder}, chest={analyzer.chest:.4f}, height={analyzer.height}")
            
            body_type_metrics = analyzer.calculate_all_metrics()
            print(f"✅ Body type metrics calculated")
            print(f"🔍 DEBUG - Metrics RIGHT AFTER calculation: shoulder_slope={body_type_metrics['shoulder_slope_angle']:.4f}, shoulder_width={body_type_metrics['shoulder_width_index']:.4f}")
            print(f"🔍 DEBUG - Metrics dict id: {id(body_type_metrics)}")
            
            # Add metrics to output
            output['body_type_metrics'] = body_type_metrics
            print(f"🔍 DEBUG - After adding to output: {id(output['body_type_metrics'])}")
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
    
        # 9. Publish Result (flat structure for backend ReportResult)
        publish({
            "report_id": report_id,
            "body_metrics": output.get('body_type_metrics'),
            "status": "COMPLETED"
        })
        print({
            "report_id": report_id,
            "body_metrics": output.get('body_type_metrics'),
            "status": "COMPLETED"
        })
        print("✅ Processing completed and published.")

    except Exception as e:
        import traceback
        traceback.print_exc()
        publish({
            "report_id": report_id if 'report_id' in locals() else None,
            "status": "FAILED",
            "error": str(e)
        })
