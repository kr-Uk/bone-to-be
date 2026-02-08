import os
import sys
import unittest.mock
import requests
from unittest.mock import MagicMock
import logging

# Ensure worker modules can be imported
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

# Import the handler (this triggers model loading, so it might take a moment)
print("⏳ Importing handler and initializing models...")
try:
    from worker.handlers.handler import handle
except ImportError as e:
    print(f"❌ Failed to import handler: {e}")
    sys.exit(1)

def local_test():
    test_images_dir = os.path.join(current_dir, 'test_images')
    
    # Create directory if it doesn't exist
    if not os.path.exists(test_images_dir):
        os.makedirs(test_images_dir)
        print(f"📂 Created {test_images_dir}")
        print("⚠️ Please put some images in this folder and run the script again.")
        return

    # Find images
    images = [f for f in os.listdir(test_images_dir) if f.lower().endswith(('.png', '.jpg', '.jpeg', '.webp'))]
    
    if not images:
        print(f"⚠️ No images found in {test_images_dir}")
        print("Please add .jpg, .png, or .webp files to this folder.")
        return

    print(f"✅ Found {len(images)} images. Starting processing...")

    # Mock data
    mock_height = 165
    mock_weight = 55
    mock_gender = 'female'

    # Mock publish function
    def mock_publish(message):
        print("\n" + "="*50)
        print(" [MOCK PUBLISH] Result:")
        print(f" Report ID (Filename): {message.get('report_id')}")
        print(f" Status: {message.get('status')}")
        if message.get('error'):
            print(f" Error: {message.get('error')}")
        if message.get('body_metrics'):
            print(" Body Metrics:")
            for k, v in message['body_metrics'].items():
                print(f"   - {k}: {v}")
        print("="*50 + "\n")

    # Mock Request Response
    class MockResponse:
        def __init__(self, content):
            self.content = content
            self.headers = {'Content-Type': 'image/jpeg'}
            self.status_code = 200
            
        def raise_for_status(self):
            pass

    # Mock Session
    class MockSession:
        def __enter__(self):
            return self
        def __exit__(self, exc_type, exc_val, exc_tb):
            pass
        def get(self, url, timeout=None):
            # In our mock, 'url' is the local file path
            if os.path.exists(url):
                with open(url, 'rb') as f:
                    content = f.read()
                return MockResponse(content)
            else:
                raise FileNotFoundError(f"File not found: {url}")

    # [Visualizer Setup] Initialize once to avoid EGL context exhaustion
    hd_renderer = None
    try:
        os.environ['PYOPENGL_PLATFORM'] = 'egl'
        import cv2
        import numpy as np
        import PIL.Image as pil_img
        import PIL.ImageDraw
        from regressor.human_shape.utils import HDRenderer, COLORS
        from worker.utils.vis_utils import weak_persp_to_blender
        
        print("🎨 Initializing HDRenderer (Once)...")
        hd_renderer = HDRenderer()
    except Exception as e:
        print(f"⚠️ Failed to initialize renderer: {e}")

    # Patch 'worker.handlers.handler.publish' and 'requests.Session'
    all_results = []
    all_debug_info = []
    
    def capture_result(message):
        # Print to console
        mock_publish(message)
        
        # Add to results for file saving
        all_results.append(message)

    with unittest.mock.patch('worker.handlers.handler.publish', side_effect=capture_result), \
         unittest.mock.patch('worker.handlers.handler.requests.Session', side_effect=MockSession):

        for img_name in images:
            img_path = os.path.join(test_images_dir, img_name)
            
            # Construct mock message
            message = {
                "reportId": img_name, 
                "weight": mock_weight,
                "height": mock_height,
                "gender": mock_gender,
                "presignedUrl": img_path,
                # [DEBUG] Request Visualization
                "debug_vis_dir": os.path.join(current_dir, 'debug_vis')
            }
            
            print(f"▶ Processing: {img_name}")
            try:
                # [Capture Output] Handler now returns output for testing
                output = handle(message)
                
                # Extract debug_info from output (not from published message)
                if output and output.get('debug_info'):
                    all_debug_info.append({
                        'report_id': img_name,
                        'debug_info': output.get('debug_info')
                    })
                
                # ---------------------------------------------------------
                # [Visualizer] Reuse Renderer
                # ---------------------------------------------------------
                debug_vis_dir = message.get('debug_vis_dir')
                if debug_vis_dir and output and hd_renderer:
                    try:
                        os.makedirs(debug_vis_dir, exist_ok=True)
                        
                        # 1. Load Image (Local Path)
                        img = cv2.imread(img_path)
                        if img is None:
                            print(f"⚠️ Failed to load image for viz: {img_path}")
                        else:
                            H, W, _ = img.shape
                            img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
                            img_float = img_rgb.astype(np.float32) / 255.0
                            bg_img = img_float.transpose(2, 0, 1) # (3, H, W)
                            bg_imgs = bg_img[np.newaxis, ...] 
                            
                            # 2. Extract Data
                            body_targets = output.get('body_targets')
                            stage_n_out = output.get('stage_02')
                            
                            if body_targets and stage_n_out:
                                vertices = stage_n_out['vertices'].detach().cpu().numpy()
                                faces = stage_n_out['faces']
                                
                                camera_parameters = output['camera_parameters']
                                camera_scale = camera_parameters['scale'].detach()
                                camera_transl = camera_parameters['translation'].detach()
                                
                                # 3. Convert Camera
                                hd_params = weak_persp_to_blender(
                                    body_targets,
                                    camera_scale=camera_scale,
                                    camera_transl=camera_transl,
                                    H=H, W=W,
                                    sensor_width=36,
                                    focal_length=5000,
                                )
                                
                                # 4. Render (Reusing hd_renderer)
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
                                
                                # Composite
                                overlay = overlays[0].transpose(1, 2, 0)
                                overlay = np.clip(overlay * 255, 0, 255).astype(np.uint8)
                                
                                overlay_img = pil_img.fromarray(overlay, mode='RGBA')
                                base_img = pil_img.fromarray(img_rgb, mode='RGB').convert('RGBA')
                                combined = pil_img.alpha_composite(base_img, overlay_img)
                                
                                save_path = os.path.join(debug_vis_dir, f"{message.get('reportId')}_mesh.png")
                                
                                # ---------------------------------------------------------
                                # [DEBUG POINT VISUALIZATION]
                                # ---------------------------------------------------------
                                debug_info = output.get('debug_info')
                                if debug_info:
                                    draw = PIL.ImageDraw.Draw(combined)
                                    
                                    # Projection Helper
                                    def project_point(p3d):
                                        # p3d: [x, y, z]
                                        # 1. Camera Transform
                                        cam_t = hd_params['transl'][0] # [tx, ty, tz]
                                        p_cam = p3d + cam_t
                                        
                                        # 2. Perspective Projection
                                        f = hd_params['focal_length_in_px'][0]
                                        c = hd_params['center'][0] # [cx, cy]
                                        
                                        x_2d = f * p_cam[0] / p_cam[2] + c[0]
                                        y_2d = f * p_cam[1] / p_cam[2] + c[1]
                                        return (x_2d, y_2d)
                                    
                                    # 1. Waist Points (Spine2, Pelvis)
                                    coords = debug_info.get('coordinates', {})
                                    spine2 = coords.get('spine2')
                                    pelvis = coords.get('pelvis')
                                    
                                    if spine2 and pelvis:
                                        p_spine2 = project_point(np.array(spine2))
                                        p_pelvis = project_point(np.array(pelvis))
                                        
                                        # Draw Line
                                        draw.line([p_spine2, p_pelvis], fill=(0, 255, 0, 255), width=3)
                                        # Draw Points
                                        r = 5
                                        draw.ellipse([p_spine2[0]-r, p_spine2[1]-r, p_spine2[0]+r, p_spine2[1]+r], fill=(255, 0, 0, 255))
                                        draw.ellipse([p_pelvis[0]-r, p_pelvis[1]-r, p_pelvis[0]+r, p_pelvis[1]+r], fill=(255, 0, 0, 255))
                                        
                                    # 2. Neck Points (Neck Base, Chin)
                                    neck = coords.get('neck')
                                    neck_meas = debug_info.get('neck_measurement', {})
                                    chin_y = neck_meas.get('chin_y')
                                    
                                    if neck and chin_y is not None:
                                        # Find approximate chin 3D point (vertex with closest Y)
                                        # We need to search in head region to avoid feet etc.
                                        head_y = coords.get('head')[1]
                                        
                                        # Filter vertices similar to search logic
                                        candidates = vertices[0] # (N, 3)
                                        # Simple filter: near head_y and matching chin_y
                                        # (Assume chin is detected correctly, just find the point)
                                        # Just find vertex with y closest to chin_y within head vicinity
                                        
                                        # Head vicinity mask
                                        mask = (candidates[:, 1] > head_y - 0.2) & (candidates[:, 1] < head_y + 0.1)
                                        valid_verts = candidates[mask]
                                        
                                        if len(valid_verts) > 0:
                                            # Find vertex closest to chin_y
                                            idx = np.argmin(np.abs(valid_verts[:, 1] - chin_y))
                                            chin_3d = valid_verts[idx]
                                            
                                            p_neck = project_point(np.array(neck))
                                            p_chin = project_point(chin_3d)
                                            
                                            # Draw Line
                                            draw.line([p_neck, p_chin], fill=(0, 0, 255, 255), width=3)
                                            # Draw Points
                                            r = 5
                                            draw.ellipse([p_neck[0]-r, p_neck[1]-r, p_neck[0]+r, p_neck[1]+r], fill=(255, 255, 0, 255))
                                            draw.ellipse([p_chin[0]-r, p_chin[1]-r, p_chin[0]+r, p_chin[1]+r], fill=(0, 255, 255, 255))

                                combined.save(save_path)
                                print(f"✅ Saved visualization: {save_path}")

                    except Exception as e:
                        print(f"⚠️ Visualization failed: {e}")
                        import traceback
                        traceback.print_exc()

            except Exception as e:
                print(f"❌ Exception while processing {img_name}: {e}")
                import traceback
                traceback.print_exc()
        
        # Save results to file
        output_file = os.path.join(current_dir, 'test_results.json')
        import json
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(all_results, f, indent=2, ensure_ascii=False)
        print(f"\n✅ Results saved to: {output_file}")
        
        # Save debug info to separate file
        if all_debug_info:
            debug_file = os.path.join(current_dir, 'test_debug.json')
            with open(debug_file, 'w', encoding='utf-8') as f:
                json.dump(all_debug_info, f, indent=2, ensure_ascii=False)
            print(f"✅ Debug info saved to: {debug_file}")


class DualLogger:
    def __init__(self, filepath):
        self.terminal = sys.stdout
        self.log = open(filepath, "w", encoding='utf-8')

    def write(self, message):
        self.terminal.write(message)
        self.log.write(message)

    def flush(self):
        self.terminal.flush()
        self.log.flush()

if __name__ == "__main__":
    # Redirect stdout and stderr to log file while keeping console output
    log_file = os.path.join(current_dir, 'test_console.log')
    sys.stdout = DualLogger(log_file)
    sys.stderr = sys.stdout
    
    local_test()
