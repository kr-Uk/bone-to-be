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
        output = shapy_runner.run(img, body25_keypoints, gender=gender)
        print(f"✅ Shapy inference completed")
        
        # DEBUG:        # Shapy output simple debug log
        measurements = output['measurements']
        print(f"🔍 DEBUG - Shapy output: chest={measurements['chest'][0]:.4f}, waist={measurements['waist'][0]:.4f}")

        # 5. Body Type Analysis - Calculate 11 metrics
        print(f"📊 Calculating body type metrics...")
        from body_type_analyzer import BodyTypeAnalyzer
        
        try:
            analyzer = BodyTypeAnalyzer(
                vertices=output['stage_02']['vertices'][0],  # (10475, 3)
                joints=output['stage_02']['joints'][0],      # (127, 3)
                measurements=output['measurements'],
                height=height  # Pass height for accurate calculations
            )
            
            body_type_metrics, debug_info = analyzer.calculate_all_metrics(debug=True)
            print(f"✅ Body type metrics calculated")
            
            # Add metrics to output
            output['body_type_metrics'] = body_type_metrics
            output['debug_info'] = debug_info
        except Exception as e:
            print(f"⚠️ Warning: Body type analysis failed: {e}")
            # Continue without metrics if analysis fails
            output['body_type_metrics'] = None
            output['debug_info'] = None

        # ---------------------------------------------------------
        # [Visualizer] Render Mesh Overlay if requested
        # ---------------------------------------------------------
        debug_vis_dir = message.get("debug_vis_dir")
        if debug_vis_dir:
            print(f"🎨 Generating debug visualization to: {debug_vis_dir}")
            try:
                os.makedirs(debug_vis_dir, exist_ok=True)
                
                # Lazy import to avoid overhead if not visualizing
                # Force EGL for headless rendering
                os.environ['PYOPENGL_PLATFORM'] = 'egl'
                
                from regressor.human_shape.utils import HDRenderer, COLORS
                from worker.utils.vis_utils import weak_persp_to_blender
                import PIL.Image as pil_img

                # 1. Prepare Background Image (Original Image)
                # img is (H, W, 3) BGR uint8
                H, W, _ = img.shape
                img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
                img_float = img_rgb.astype(np.float32) / 255.0
                bg_img = img_float.transpose(2, 0, 1) # (3, H, W)
                bg_imgs = bg_img[np.newaxis, ...] # (1, 3, H, W)

                # 2. Get Data from Output
                body_targets = output.get('body_targets')
                stage_n_out = output.get('stage_02')
                
                if not body_targets or not stage_n_out:
                    print("⚠️ Visualization skipped: Missing targets or stage output")
                else:
                    vertices = stage_n_out['vertices'].detach().cpu().numpy()
                    faces = stage_n_out['faces'] # faces is likely a tensor or numpy array shared
                    
                    camera_parameters = output['camera_parameters']
                    camera_scale = camera_parameters['scale'].detach()
                    camera_transl = camera_parameters['translation'].detach()

                    # 3. Convert Camera Parameters
                    hd_params = weak_persp_to_blender(
                        body_targets,
                        camera_scale=camera_scale,
                        camera_transl=camera_transl,
                        H=H, W=W,
                        sensor_width=36, # Default
                        focal_length=5000, # Default
                    )

                    # 4. Render
                    # Initialize Renderer (Singleton-like usually, but per-call is safer here if infrequent)
                    hd_renderer = HDRenderer()
                    
                    # Render for the first person (batch 0)
                    idx = 0 
                    body_color = COLORS.get('stage_02', COLORS['default'])
                    
                    overlays = hd_renderer(
                        vertices, faces,
                        focal_length=hd_params['focal_length_in_px'],
                        camera_translation=hd_params['transl'],
                        camera_center=hd_params['center'],
                        bg_imgs=bg_imgs,
                        return_with_alpha=True,
                        body_color=body_color,
                    )
                    
                    # overlays is (B, 4, H, W) or (B, H, W, 4)?
                    # demo.py: out_img[f'hd_{stage_key}_cat'] = np.concatenate([bg_hd_imgs, overlays], axis=-1)
                    # This implies channel-last?
                    # Let's check demo.py again.
                    # line 263: bg_hd_imgs = np.transpose(hd_imgs, [0, 3, 1, 2]) -> (B, C, H, W)
                    # line 303: np.concatenate([bg_hd_imgs, overlays], axis=-1) -> This implies 'overlays' matches dimensions?
                    # Wait, if bg_hd_imgs is (B, C, H, W), concatenating on axis -1 (W) makes it wider side-by-side.
                    # Ah, demo.py saves 'hd_imgs' which is (B, 3, H, W) transposed back to (B, H, W, 3) later for saving.
                    
                    # Let's check typical pyrender output. usually (H, W, 4).
                    # HDRenderer usually returns (B, C, H, W) if it mimics the input style?
                    # Let's assume overlays is (B, 4, H, W) to match bg_imgs (B, 3, H, W).
                    
                    # For saving, we want (H, W, C).
                    pass # Just debug print logic flow
                    
                    # Convert overlay to HWC
                    # overlay_np = overlays[0].transpose(1, 2, 0) # (H, W, 4) if it was (4, H, W)
                    
                    # Actually, let's just trust whatever HDRenderer returns and check shape.
                    # But simpler: we just save the overlay itself? Or composite?
                    # User likely wants "overlay on image".
                    
                    # Let's inspect 'overlays' shape from logs if it fails, or assume (B, 4, H, W) based on bg_imgs arg.
                    overlay = overlays[0].transpose(1, 2, 0) # Assume (4, H, W) -> (H, W, 4)
                    
                    # Clip and Scale
                    overlay = np.clip(overlay * 255, 0, 255).astype(np.uint8)
                    
                    # Composite (Alpha Blending)
                    # img_rgb is (H, W, 3) uint8
                    overlay_img = pil_img.fromarray(overlay, mode='RGBA')
                    base_img = pil_img.fromarray(img_rgb, mode='RGB').convert('RGBA')
                    
                    # Composite
                    combined = pil_img.alpha_composite(base_img, overlay_img)
                    
                    # 5. [NEW] Maximize Debugging: Draw Keypoints too!
                    # keypoints in 'body_targets' are in CROP coordinates? No, HumanShapeTarget stores them.
                    # Let's use the 'body25_keypoints' variable we have in this scope (from step 3 of handle)
                    # body25_keypoints is (25, 3) in PIXEL coordinates of original image.
                    
                    for k in range(25):
                        x, y, conf = body25_keypoints[k]
                        if conf > 0.1:
                           # Draw circle
                           # coordinates might be float
                           ix, iy = int(x), int(y)
                           # Draw on PIL image
                           from PIL import ImageDraw
                           draw = ImageDraw.Draw(combined)
                           draw.ellipse((ix-3, iy-3, ix+3, iy+3), fill=(0, 255, 0, 255), outline=(0, 0, 0, 255))
                           draw.text((ix+5, iy), str(k), fill=(0, 255, 0, 255))

                    # Save
                    save_path = os.path.join(debug_vis_dir, f"{report_id}_mesh.png")
                    combined.save(save_path)
                    print(f"✅ Saved mesh visualization with keypoints: {save_path}")

            except Exception as e:
                print(f"⚠️ Visualization failed: {e}")
                import traceback
                traceback.print_exc()


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
            "debug_info": output.get('debug_info'),
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
