#!/bin/bash
set -e

# 1. Conda Environment Setup
ENV_NAME="shapy_new"
PYTHON_VERSION="3.10"

echo "🚀 [1/6] Removing old environment (if exists)..."
conda env remove -n $ENV_NAME -y || true

echo "🚀 [2/6] Creating new Conda environment ($ENV_NAME with Python $PYTHON_VERSION)..."
conda create -n $ENV_NAME python=$PYTHON_VERSION -y

# Instructions for the user to activate
echo ""
echo "⭐⭐⭐ IMPORTANT ⭐⭐⭐"
echo "Conda activation cannot be scripted easily inside a shell script."
echo "Please run the following commands MANUALLY in your terminal:"
echo ""
echo "    conda activate $ENV_NAME"
echo "    ./finish_install.sh"
echo ""
echo "I have created 'finish_install.sh' for the next steps."
