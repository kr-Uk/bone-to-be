#!/bin/bash
set -e

# =================================================================
# 🏃 Shapy Body Worker - Local WSL Execution Script
# =================================================================
# Use this script to run the worker directly on WSL (no Docker).
# =================================================================

# 1. Determine Paths
CURRENT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
AI_ROOT="$CURRENT_DIR"
SHAPY_DIR="$AI_ROOT/shapy"
WORKER_DIR="$AI_ROOT/workers/body-worker"

echo "📂 AI Root:    $AI_ROOT"
echo "📂 Shapy Dir:  $SHAPY_DIR"
echo "📂 Worker Dir: $WORKER_DIR"

# 2. Setup Environment Variables
export RABBITMQ_HOST="localhost"
export RABBITMQ_PORT=5672
export RABBITMQ_USERNAME="guest"
export RABBITMQ_PASSWORD="guest"
export REQUEST_QUEUE="body-worker.requested"
export COMPLETED_QUEUE="body-worker.completed"

# CRITICAL: Point to Shapy directory so handler.py can import it
export SHAPY_PATH="$SHAPY_DIR"

# Force Headless Rendering for PyRender (if not using X server)
export PYOPENGL_PLATFORM=egl

echo "✅ Environment variables set."

# 3. Check & Install Dependencies (Optional but recommended)
echo "📦 Checking Python dependencies..."
# It's better to install requirements from both shapy and worker
pip install -r "$SHAPY_DIR/requirements.txt" || echo "⚠️ Warning: Failed to install Shapy requirements"
pip install -r "$WORKER_DIR/requirements.txt" || echo "⚠️ Warning: Failed to install Worker requirements"

# 4. Run Worker
echo "🚀 Starting Body Worker..."
cd "$WORKER_DIR"
python main.py
