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

    # Patch 'worker.handlers.handler.publish' and 'requests.Session'
    all_results = []
    all_debug_info = []
    
    def capture_result(message):
        # Print to console
        mock_publish(message)
        
        # Separate debug info from result
        debug_info = message.pop('debug_info', None)
        
        # Add to lists for file saving
        all_results.append(message)
        if debug_info:
            all_debug_info.append({
                'report_id': message.get('report_id'),
                'debug_info': debug_info
            })

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
                "gender": mock_gender,
                "presignedUrl": img_path,
                # [DEBUG] Request Visualization
                "debug_vis_dir": os.path.join(current_dir, 'debug_vis')
            }
            
            print(f"▶ Processing: {img_name}")
            try:
                handle(message)
            except Exception as e:
                print(f"❌ Exception while processing {img_name}: {e}")
        
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
