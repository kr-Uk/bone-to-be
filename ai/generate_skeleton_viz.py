
import cv2
import numpy as np
import torch
from ultralytics import YOLO
from PIL import Image, ImageDraw, ImageFont
import os
import requests

# 1. Configuration
# The user uploaded the file to this path in Windows, but we are in WSL.
# We need to access it via /mnt/c/...
# Original: C:/Users/SSAFY/.gemini/antigravity/brain/1d28cdeb-352f-4054-b0de-708fd8fb969d/uploaded_media_1769745769182.jpg
IMAGE_PATH = "uploaded_media_1769745769182.jpg"
OUTPUT_PATH = "visualized_body_analysis.png"
FONT_URL = "https://github.com/google/fonts/raw/main/ofl/nanumgothic/NanumGothic-Bold.ttf"
FONT_PATH = "NanumGothic-Bold.ttf"

# Metric Definitions based on user request
KEYPOINT_LABELS = {
    0: "코 (Nose)",
    # 1: "눈 (Eye)", # Too crowded
    # 2: "눈 (Eye)",
    # 3: "귀 (Ear)",
    # 4: "귀 (Ear)",
    5: "왼쪽 어깨 (L.Shoulder)",
    6: "오른쪽 어깨 (R.Shoulder)",
    7: "왼쪽 팔꿈치 (L.Elbow)",
    8: "오른쪽 팔꿈치 (R.Elbow)",
    9: "왼쪽 손목 (L.Wrist)",
    10: "오른쪽 손목 (R.Wrist)",
    11: "왼쪽 골반 (L.Hip)",
    12: "오른쪽 골반 (R.Hip)",
    13: "왼쪽 무릎 (L.Knee)",
    14: "오른쪽 무릎 (R.Knee)",
    15: "왼쪽 발목 (L.Ankle)",
    16: "오른쪽 발목 (R.Ankle)"
}

# 2. Download Font if not exists
if not os.path.exists(FONT_PATH):
    print("Downloading NanumGothic font...")
    try:
        response = requests.get(FONT_URL)
        response.raise_for_status()
        with open(FONT_PATH, "wb") as f:
            f.write(response.content)
        print("Font downloaded.")
    except Exception as e:
        print(f"Failed to download font: {e}")
        # Fallback will be handled later

# 3. Load Model
print("Loading YOLO model...")
model_path = 'yolo11m-pose.pt'
if not os.path.exists(model_path):
    print(f"Warning: {model_path} not found in current directory. Using 'yolov8n-pose.pt' or downloading.")
    model_path = 'yolov8n-pose.pt' # Ultralytics will auto-download

model = YOLO(model_path) 

# 4. Load Image
if not os.path.exists(IMAGE_PATH):
    print(f"Error: Image not found at {IMAGE_PATH}")
    # Try finding it in current directory just in case
    local_name = os.path.basename(IMAGE_PATH)
    if os.path.exists(local_name):
        IMAGE_PATH = local_name
    else:
        print("Could not find image. Please check the path.")
        # For testing, we might want to fail gracefully or create a dummy, but let's exit.
        exit(1)

print(f"Processing {IMAGE_PATH}...")
img_cv2 = cv2.imread(IMAGE_PATH)
if img_cv2 is None:
    print("Failed to load image. Check format.")
    exit(1)

img_rgb = cv2.cvtColor(img_cv2, cv2.COLOR_BGR2RGB)
pil_image = Image.fromarray(img_rgb)
draw = ImageDraw.Draw(pil_image)

# 5. Inference
results = model(img_rgb, conf=0.5, verbose=False)
if not results or not results[0].keypoints:
    print("No person detected.")
    exit(1)

kps = results[0].keypoints.data[0].cpu().numpy() # (17, 3) : x, y, conf

# 6. Draw
try:
    font = ImageFont.truetype(FONT_PATH, 20)
    title_font = ImageFont.truetype(FONT_PATH, 30)
except:
    print("Using default font (Korean may not render).")
    font = ImageFont.load_default()
    title_font = ImageFont.load_default()

width, height = pil_image.size

# Draw Connections (Generic Skeleton)
SKELETON_CONNECTIONS = [
    (5, 7), (7, 9), # Left Arm
    (6, 8), (8, 10), # Right Arm
    (5, 6), # Shoulders
    (5, 11), (6, 12), # Torso
    (11, 12), # Hips
    (11, 13), (13, 15), # Left Leg
    (12, 14), (14, 16)  # Right Leg
]

for p1, p2 in SKELETON_CONNECTIONS:
    if len(kps) > max(p1, p2) and kps[p1][2] > 0.5 and kps[p2][2] > 0.5:
        x1, y1 = kps[p1][:2]
        x2, y2 = kps[p2][:2]
        draw.line([(x1, y1), (x2, y2)], fill=(0, 255, 0), width=3)

# Draw Points and Labels
for idx, (x, y, conf) in enumerate(kps):
    if conf > 0.5 and idx in KEYPOINT_LABELS:
        # Draw Point
        r = 5
        draw.ellipse((x-r, y-r, x+r, y+r), fill=(255, 0, 0), outline=(255, 255, 255))
        
        # Draw Label
        label = KEYPOINT_LABELS[idx]
        
        # Dynamic label positioning
        text_x = x + 15
        text_y = y - 10
        if idx in [5, 7, 9, 11, 13, 15]: # Left side components often on right of image (subject's left)
             # Actually image left is subject right usually, let's keep it simple
             pass
        
        # Check bounds
        if text_x + 100 > width: text_x = x - 120
        if text_x < 0: text_x = x + 10
        
        # Draw text background
        bbox = draw.textbbox((text_x, text_y), label, font=font)
        draw.rectangle(bbox, fill="white", outline="black")
        draw.text((text_x, text_y), label, font=font, fill="black")

# 7. Add Explanatory Text (Metrics)
explanations = [
    "측정 지표 (Body Metrics):",
    "1. 어깨 기울기 (Shoulder Slope)",
    "2. 어깨 너비 (Shoulder Width)",
    "3. 골반 너비 (Hip Width)",
    "4. 어깨/골반 비율 (Shoulder-Hip Ratio)",
    "5. 상체 두께 (Upper Body Depth)",
    "6. 흉곽 볼륨 (Ribcage Volume)",
    "7. 허리 곡률 (Waist Curvature)",
    "8. 관절 두께 (Joint Thickness)",
    "9. 팔/몸통 비율 (Arm-Torso Ratio)",
    "10. 체형 직선성 (Linearity)",
    "11. 다리 길이 (Leg Length)"
]

# Side box for explanations
start_y = 50
max_width_text = 0
for line in explanations:
    bbox = draw.textbbox((0, 0), line, font=font)
    w = bbox[2] - bbox[0]
    if w > max_width_text: max_width_text = w

draw.rectangle([(10, 10), (max_width_text + 30, start_y + len(explanations)*35 + 20)], fill=(255, 255, 255, 220), outline="black")

for i, line in enumerate(explanations):
    draw.text((20, start_y + i*35), line, font=font, fill="black")

# 8. Save
pil_image.save(OUTPUT_PATH)
print(f"Saved visualization to {os.path.abspath(OUTPUT_PATH)}")
