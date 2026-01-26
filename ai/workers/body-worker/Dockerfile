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
COPY workers/body-worker/requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# 2. Copy Shapy Code (Shared Library)
COPY shapy /app/shapy
ENV SHAPY_PATH=/app/shapy

# 3. Copy Worker Code
COPY workers/body-worker /app/worker_code
WORKDIR /app/worker_code

CMD ["python", "main.py"]
