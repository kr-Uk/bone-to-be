import cv2
import numpy as np
from ultralytics import YOLO

from runner import ShapyRunner


# --------------------------------------------------
# 1. YOLO pose 모델 로드
# --------------------------------------------------
yolo = YOLO("yolo11m-pose.pt")


# --------------------------------------------------
# 2. 이미지 로드
# --------------------------------------------------
img = cv2.imread("examples/aikoreanwoman.jpg")
h, w = img.shape[:2]


# --------------------------------------------------
# 3. YOLO pose 추론
# --------------------------------------------------
results = yolo(img, conf=0.5)

# 사람 1명 기준
yolo_kps = results[0].keypoints.data[0].cpu().numpy()
# shape: (17, 3)


# --------------------------------------------------
# 4. SHAPY inference
# --------------------------------------------------
runner = ShapyRunner(device="cuda")

output = runner.run(
    image_height=h,
    image_width=w,
    yolo_keypoints=yolo_kps
)


# --------------------------------------------------
# 5. 결과 확인
# --------------------------------------------------
print(output.keys())
print(output["betas"])
print(output["joints"].shape)
print(output["vertices"].shape)