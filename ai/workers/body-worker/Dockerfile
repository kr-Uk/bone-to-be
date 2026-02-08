<<<<<<< Updated upstream
FROM python:3.8-slim

# Install system dependencies for OpenCV, Pyrender (EGL), and X11 support
RUN apt-get update && apt-get install -y \
=======
FROM nvidia/cuda:11.3.1-devel-ubuntu20.04

# Avoid interaction during apt install
ENV DEBIAN_FRONTEND=noninteractive

# Install Python 3.8, pip, git, and system libraries for OpenCV/EGL
RUN apt-get update && apt-get install -y \
    python3.8 \
    python3-pip \
    python3.8-dev \
    git \
>>>>>>> Stashed changes
    libgl1 \
    libegl1 \
    libopengl0 \
    libglib2.0-0 \
<<<<<<< Updated upstream
    gcc \
    libxrender1 \
    libxtst6 \
    libxi6 \
    && rm -rf /var/lib/apt/lists/*

# Force Pyrender to use EGL (headless) instead of X11
=======
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
>>>>>>> Stashed changes
ENV PYOPENGL_PLATFORM=egl

WORKDIR /app

<<<<<<< Updated upstream
# 1. Install dependencies first (caching)
# Assumes build context is 'ai' root
COPY workers/body-worker/requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# 2. Copy Shapy Code (Shared Library)
COPY shapy /app/shapy
ENV SHAPY_PATH=/app/shapy

=======
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

>>>>>>> Stashed changes
# 3. Copy Worker Code
COPY workers/body-worker /app/worker_code
WORKDIR /app/worker_code

CMD ["python", "main.py"]
