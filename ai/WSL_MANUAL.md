# 🐧 WSL Local Execution Guide

Since Docker builds are taking too long, we will run the worker directly on your WSL (Ubuntu) environment. This allows for faster debugging.

## 1. Prerequisites (WSL)
Open your WSL terminal (e.g., Ubuntu 20.04/22.04).
Ensure you are in the project `ai` directory.

```bash
# Example
cd /mnt/c/Users/SSAFY/Desktop/S14P11D210/ai
```

## 2. Install System Dependencies
Install the required libraries for OpenCV and PyRender (Shapy).

```bash
sudo apt-get update && sudo apt-get install -y \
    libgl1 \
    libegl1 \
    libopengl0 \
    libglib2.0-0 \
    gcc \
    libxrender1 \
    libxtst6 \
    libxi6
```

## 3. Setup Python Environment
It is recommended to use a virtual environment or Conda (if available).

```bash
# Option A: Python venv
python3 -m venv venv
source venv/bin/activate

# Option B: Conda (if installed)
# conda create -n body-worker python=3.8 -y
# conda activate body-worker
```

## 4. Run the Worker Script
We have prepared a script `run_worker_local.sh` that sets up all environment variables and paths for you.

```bash
# 1. Give execution permission
chmod +x run_worker_local.sh

# 2. Run!
./run_worker_local.sh
```

## 5. Send Test Message (from Windows or WSL)
Open another terminal (Windows PowerShell is fine) and send a test request.

```bash
cd c:\Users\SSAFY\Desktop\S14P11D210\ai
python send_test_message.py "https://your-image-url.com/image.jpg"
```

## Troubleshooting
If you see missing module errors (e.g. `ModuleNotFoundError`), the script should have tried to `pip install` them. You can manually install if needed:

```bash
pip install -r shapy/requirements.txt
pip install -r workers/body-worker/requirements.txt
```
