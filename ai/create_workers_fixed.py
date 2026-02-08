import os

workers_dir = "workers"
worker_name = "body-worker"
base = os.path.join(workers_dir, worker_name)

os.makedirs(base, exist_ok=True)
os.makedirs(os.path.join(base, "worker", "handlers"), exist_ok=True)

print(f"🚀 Recreating {worker_name}...")

# 1. Dockerfile (NVIDIA Base for NVCC)
with open(os.path.join(base, "Dockerfile"), "w", encoding="utf-8") as f:
    f.write(r"""FROM nvidia/cuda:11.3.1-devel-ubuntu20.04

# Avoid interaction during apt install
ENV DEBIAN_FRONTEND=noninteractive

# Install Python 3.8, pip, git, and system libraries for OpenCV/EGL
RUN apt-get update && apt-get install -y \
    python3.8 \
    python3-pip \
    python3.8-dev \
    git \
    libgl1 \
    libegl1 \
    libopengl0 \
    libglib2.0-0 \
    libxrender1 \
    libxtst6 \
    libxi6 \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Link python3 to python3.8
RUN ln -f -s /usr/bin/python3.8 /usr/bin/python && \
    ln -f -s /usr/bin/python3.8 /usr/bin/python3

# Upgrade pip
RUN python -m pip install --upgrade pip

# Force Pyrender EGL
ENV PYOPENGL_PLATFORM=egl

WORKDIR /app

# 1. Install Dependencies
COPY workers/body-worker/requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# 2. Copy Shapy Code
COPY shapy /app/shapy
ENV SHAPY_PATH=/app/shapy

# Build Extensions (using system nvcc)
ENV FORCE_CUDA=1
ENV TORCH_CUDA_ARCH_LIST="7.0;7.5;8.0;8.6;8.9"
RUN cd /app/shapy && \
    chmod +x install_modules.sh && \
    ./install_modules.sh

# 3. Copy Worker Code
COPY workers/body-worker /app/worker_code
WORKDIR /app/worker_code

CMD ["python", "main.py"]
""")

# 2. requirements.txt
with open(os.path.join(base, "requirements.txt"), "w", encoding="utf-8") as f:
    f.write("""pika==1.3.2
python-dotenv==1.0.1
ultralytics
opencv-python
requests
torch
numpy<1.20
chumpy
imageio
jpeg4py
joblib
kornia
loguru
matplotlib
omegaconf
open3d
Pillow
PyOpenGL
pyrender
pytorch-lightning
scikit-image
scikit-learn
scipy
smplx
torchgeometry
torchmetrics
torchvision
tqdm
trimesh
yacs
fvcore
nflows
PyYAML
""")

# 3. handler.py (FIXED: Paths & CDN logic)
with open(os.path.join(base, "worker", "handlers", "handler.py"), "w", encoding="utf-8") as f:
    f.write(r"""import sys
import os
import cv2
import numpy as np
import torch
from ultralytics import YOLO
import requests

# ---------------------------------------------------------
# Path Setup for Shapy
# ---------------------------------------------------------
SHAPY_DIR = os.getenv("SHAPY_PATH")

if not SHAPY_DIR:
    # Fallback to local relative path
    CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
    AI_ROOT = os.path.abspath(os.path.join(CURRENT_DIR, "..", "..", "..", ".."))
    SHAPY_DIR = os.path.join(AI_ROOT, "shapy")

if SHAPY_DIR not in sys.path:
    sys.path.insert(0, SHAPY_DIR)
    print(f"🔗 Added Shapy to path: {SHAPY_DIR}")

# Add sub-modules
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

try:
    from runner import ShapyRunner
except ImportError:
    print(f"❌ Error: Could not import runner from {SHAPY_DIR}")
    raise

from worker.publisher import publish

# ---------------------------------------------------------
# Global Models
# ---------------------------------------------------------
print("⏳ Initializing models...")
try:
    yolo_model = YOLO('yolo11m-pose.pt') 
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
        publish({"status": "ERROR", "error": "Models not initialized", "request": message})
        return

    try:
        image_url = message.get("image_url")
        image_path = message.get("image_path")
        img = None

        if image_url:
            print(f"🌐 Downloading image from {image_url}...")
            try:
                with requests.Session() as session:
                    resp = session.get(image_url, timeout=15)
                    resp.raise_for_status()
                    arr = np.asarray(bytearray(resp.content), dtype=np.uint8)
                    img = cv2.imdecode(arr, -1)
                    if img is None: raise ValueError("Decode failed")
            except Exception as e:
                print(f"❌ Download failed: {e}")
                publish({"status": "ERROR", "message": str(e), "request": message})
                return
        elif image_path:
            if os.path.exists(image_path):
                img = cv2.imread(image_path)
            else:
                print(f"File not found: {image_path}")

        if img is None:
            publish({"status": "ERROR", "message": "No valid image found", "request": message})
            return

        # YOLO
        results = yolo_model(img, verbose=False, classes=[0], conf=0.5)
        if not results or not results[0].keypoints or results[0].keypoints.data.shape[1] == 0:
            publish({"status": "ERROR", "message": "No person detected", "request": message})
            return

        keypoints = results[0].keypoints.data[0].cpu().numpy()

        # Shapy
        output = shapy_runner.run(img, keypoints)

        # Serialize
        serialized_output = {}
        for k, v in output.items():
            if hasattr(v, 'detach'):
                serialized_output[k] = v.detach().cpu().numpy().tolist()
            elif isinstance(v, np.ndarray):
                serialized_output[k] = v.tolist()
            else:
                serialized_output[k] = v

        publish({"status": "COMPLETED", "result": serialized_output, "request": message})
        print("✅ Processing completed.")

    except Exception as e:
        import traceback
        traceback.print_exc()
        publish({"status": "ERROR", "error": str(e), "request": message})
""")

# 4. Standard Boilerplate Files
with open(os.path.join(base, "main.py"), "w", encoding="utf-8") as f:
    f.write("""from worker.consumer import start_consumer
if __name__ == "__main__":
    start_consumer()
""")

with open(os.path.join(base, "worker", "config.py"), "w", encoding="utf-8") as f:
    f.write("""import os
from dotenv import load_dotenv
load_dotenv()
class Config:
    RABBITMQ_HOST = os.getenv("RABBITMQ_HOST")
    RABBITMQ_PORT = int(os.getenv("RABBITMQ_PORT", 5672))
    RABBITMQ_USERNAME = os.getenv("RABBITMQ_USERNAME")
    RABBITMQ_PASSWORD = os.getenv("RABBITMQ_PASSWORD")
    RABBITMQ_VHOST = os.getenv("RABBITMQ_VHOST", "/")
    REQUEST_QUEUE = os.getenv("REQUEST_QUEUE")
    COMPLETED_QUEUE = os.getenv("COMPLETED_QUEUE")
""")

with open(os.path.join(base, "worker", "rabbitmq.py"), "w", encoding="utf-8") as f:
    f.write("""import pika
from worker.config import Config
def create_connection():
    credentials = pika.PlainCredentials(Config.RABBITMQ_USERNAME, Config.RABBITMQ_PASSWORD)
    params = pika.ConnectionParameters(host=Config.RABBITMQ_HOST, port=Config.RABBITMQ_PORT, virtual_host=Config.RABBITMQ_VHOST, credentials=credentials, heartbeat=60)
    return pika.BlockingConnection(params)
""")

with open(os.path.join(base, "worker", "publisher.py"), "w", encoding="utf-8") as f:
    f.write("""import json
from worker.rabbitmq import create_connection
from worker.config import Config
def publish(message: dict):
    conn = create_connection()
    ch = conn.channel()
    ch.queue_declare(queue=Config.COMPLETED_QUEUE, durable=True)
    ch.basic_publish(exchange="", routing_key=Config.COMPLETED_QUEUE, body=json.dumps(message), properties=pika.BasicProperties(delivery_mode=2))
    conn.close()
import pika
""")

with open(os.path.join(base, "worker", "consumer.py"), "w", encoding="utf-8") as f:
    f.write("""import json
from worker.rabbitmq import create_connection
from worker.config import Config
from worker.handlers.handler import handle
def start_consumer():
    conn = create_connection()
    ch = conn.channel()
    ch.queue_declare(queue=Config.REQUEST_QUEUE, durable=True)
    ch.basic_qos(prefetch_count=1)
    def callback(ch, method, properties, body):
        message = json.loads(body)
        print(f"▶ {Config.REQUEST_QUEUE} received")
        handle(message)
        ch.basic_ack(delivery_tag=method.delivery_tag)
    ch.basic_consume(queue=Config.REQUEST_QUEUE, on_message_callback=callback)
    print(f"🚀 {Config.REQUEST_QUEUE} worker started")
    ch.start_consuming()
""")

print("✅ Worker files restored successfully.")
