#!/bin/bash
set -e

echo "🚀 [3/6] Installing PyTorch (CUDA 11.8)..."
# Using the command from PyTorch website for CUDA 11.8
pip install torch torchvision --index-url https://download.pytorch.org/whl/cu118

echo "🚀 [3.5/6] Adjusting pip version & installing chumpy..."
# Downgrade pip to <24.1 to allow installing omegaconf==2.0.6 (which has invalid metadata for newer pip)
pip install "pip<24.1" setuptools wheel

# Install chumpy without build isolation (fixes 'No module named pip' error)
pip install chumpy --no-build-isolation

echo "🚀 [4/6] Installing Python Dependencies..."
pip install -r shapy/requirements.txt

echo "🚀 [5/6] Building Local Extensions..."
echo "   - Building attributes..."
cd shapy/attributes
pip install .

echo "   - Building mesh-mesh-intersection..."
cd ../mesh-mesh-intersection
# Setting CUDA architecture list to avoid compilation issues on some GPUs
export TORCH_CUDA_ARCH_LIST="7.0;7.5;8.0;8.6+PTX"
pip install .

echo ""
echo "✅ [6/6] Installation Complete!"
echo "You can now run the worker script."
