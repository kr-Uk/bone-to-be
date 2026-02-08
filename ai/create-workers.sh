#!/bin/bash

set -e

WORKERS_DIR="workers"
WORKER_NAMES=("body-worker" "tryon-worker")

echo "🚀 Creating AI workers..."

mkdir -p $WORKERS_DIR

create_worker () {
  NAME=$1
  BASE="$WORKERS_DIR/$NAME"

  echo "📦 $NAME"

  mkdir -p \
    $BASE/worker/handlers

  ######################################
  # main.py
  ######################################
  cat <<EOF > $BASE/main.py
from worker.consumer import start_consumer

if __name__ == "__main__":
    start_consumer()
EOF

  ######################################
  # requirements.txt
  ######################################
  cat <<EOF > $BASE/requirements.txt
pika==1.3.2
python-dotenv==1.0.1
ultralytics
opencv-python
requests
torch
numpy
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
EOF

  ######################################
  # env example
  ######################################
  cat <<EOF > $BASE/.env.example
RABBITMQ_HOST=localhost
RABBITMQ_PORT=5672
RABBITMQ_USERNAME=guest
RABBITMQ_PASSWORD=guest
RABBITMQ_VHOST=/

REQUEST_QUEUE=${NAME}.requested
COMPLETED_QUEUE=${NAME}.completed
EOF

  ######################################
  # Dockerfile
  ######################################
  cat <<EOF > $BASE/Dockerfile
FROM python:3.8-slim

# Install system dependencies for OpenCV, Pyrender (EGL), and X11 support
RUN apt-get update && apt-get install -y \
    libgl1 \
    libegl1 \
    libopengl0 \
    libglib2.0-0 \
    gcc \
    libxrender1 \
    libxtst6 \
    libxi6 \
    && rm -rf /var/lib/apt/lists/*

# Force Pyrender to use EGL (headless) instead of X11
ENV PYOPENGL_PLATFORM=egl

WORKDIR /app

# 1. Install dependencies first (caching)
# Assumes build context is 'ai' root
COPY workers/${NAME}/requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# 2. Copy Shapy Code (Shared Library)
COPY shapy /app/shapy
ENV SHAPY_PATH=/app/shapy

# 3. Copy Worker Code
COPY workers/${NAME} /app/worker_code
WORKDIR /app/worker_code

CMD ["python", "main.py"]
EOF

  ######################################
  # config.py
  ######################################
  cat <<EOF > $BASE/worker/config.py
import os
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
EOF

  ######################################
  # rabbitmq.py
  ######################################
  cat <<EOF > $BASE/worker/rabbitmq.py
import pika
from worker.config import Config

def create_connection():
    credentials = pika.PlainCredentials(
        Config.RABBITMQ_USERNAME,
        Config.RABBITMQ_PASSWORD
    )

    params = pika.ConnectionParameters(
        host=Config.RABBITMQ_HOST,
        port=Config.RABBITMQ_PORT,
        virtual_host=Config.RABBITMQ_VHOST,
        credentials=credentials,
        heartbeat=60
    )

    return pika.BlockingConnection(params)
EOF

  ######################################
  # publisher.py
  ######################################
  cat <<EOF > $BASE/worker/publisher.py
import json
from worker.rabbitmq import create_connection
from worker.config import Config

def publish(message: dict):
    conn = create_connection()
    ch = conn.channel()

    ch.queue_declare(queue=Config.COMPLETED_QUEUE, durable=True)

    ch.basic_publish(
        exchange="",
        routing_key=Config.COMPLETED_QUEUE,
        body=json.dumps(message),
        properties={"delivery_mode": 2}
    )

    conn.close()
EOF

  ######################################
  # consumer.py
  ######################################
  cat <<EOF > $BASE/worker/consumer.py
import json
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

    ch.basic_consume(
        queue=Config.REQUEST_QUEUE,
        on_message_callback=callback
    )

    print(f"🚀 {Config.REQUEST_QUEUE} worker started")
    ch.start_consuming()
EOF

  ######################################
  # handler.py
  ######################################
  cat <<EOF > $BASE/worker/handlers/handler.py
from worker.publisher import publish
import time

def handle(message: dict):
    print("⚙️ processing...")
    time.sleep(2)

    publish({
        "request": message,
        "status": "COMPLETED"
    })
EOF

}

for w in "${WORKER_NAMES[@]}"; do
  create_worker "$w"
done

echo "✅ All workers created successfully."

