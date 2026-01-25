#!/bin/bash

########################################
# CONFIG
########################################
SESSION_NAME="ai-workers"
CONDA_ENV="shapy"

PROJECT_ROOT="$(cd "$(dirname "$0")" && pwd)"
AI_DIR="$PROJECT_ROOT/ai/workers"

BODY_WORKER_DIR="$AI_DIR/body-worker"
TRYON_WORKER_DIR="$AI_DIR/tryon-worker"

########################################
# tmux session check
########################################
if tmux has-session -t "$SESSION_NAME" 2>/dev/null; then
  echo "⚠️ tmux session '$SESSION_NAME' already running."
  echo "👉 attach with: tmux attach -t $SESSION_NAME"
  exit 0
fi

echo "🚀 starting AI workers..."

########################################
# create session
########################################
tmux new-session -d -s "$SESSION_NAME"

########################################
# body worker
########################################
tmux send-keys -t "$SESSION_NAME" "
source ~/miniconda3/etc/profile.d/conda.sh &&
conda activate $CONDA_ENV &&
cd $BODY_WORKER_DIR &&
python main.py
" C-m

########################################
# tryon worker
########################################
tmux new-window -t "$SESSION_NAME" -n tryon

tmux send-keys -t "$SESSION_NAME":1 "
source ~/miniconda3/etc/profile.d/conda.sh &&
conda activate $CONDA_ENV &&
cd $TRYON_WORKER_DIR &&
python main.py
" C-m

########################################
# attach
########################################
tmux attach -t "$SESSION_NAME"

