FROM python:3.11-slim

# Install system dependencies for OpenCV and builds
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    gcc \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 1. Install dependencies first (caching)
# Assumes build context is 'ai' root
COPY workers/body-worker/requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# 2. Copy Shapy Code (Shared Library)
COPY shapy /app/shapy
ENV SHAPY_PATH=/app/shapy

# 3. Copy Worker Code
COPY workers/body-worker /app/worker_code
WORKDIR /app/worker_code

CMD ["python", "main.py"]
