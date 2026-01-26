#!/bin/bash
set -e

# =================================================================
# 🛠️ Shapy Extension Rebuilder
# =================================================================
# This script rebuilds the C++ extensions against the CURRENTLY
# installed PyTorch version in your environment.
# =================================================================

CURRENT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SHAPY_DIR="$CURRENT_DIR/shapy"

echo "📂 Shapy Dir: $SHAPY_DIR"

# 1. Attributes Module
echo "🔧 Building 'attributes'..."

# CRITICAL: Force CUDA Architecture 8.0 (Ampere)
# PyTorch 1.7.1 + CUDA 11.0 doesn't recognize newer GPUs (Arch 8.9, RTX 40xx).
export TORCH_CUDA_ARCH_LIST="8.0"

# CRITICAL: Allow newer GCC versions (e.g. GCC 13+) even if NVCC complains
export NVCC_FLAGS="-allow-unsupported-compiler"

cd "$SHAPY_DIR/attributes"
rm -rf build dist *.egg-info
python setup.py clean --all
python setup.py install

# 2. Mesh-Mesh Intersection Module
echo "🔧 Building 'mesh-mesh-intersection'..."
cd "$SHAPY_DIR/mesh-mesh-intersection"
rm -rf build dist *.egg-info
# Ensure CUDA_SAMPLES_INC is set if needed (using local include as fallback)
export CUDA_SAMPLES_INC="$SHAPY_DIR/mesh-mesh-intersection/include"
python setup.py clean --all
python setup.py install

echo "✅ All extensions rebuilt successfully!"
echo "👉 Now try running ./run_worker_local.sh again."
