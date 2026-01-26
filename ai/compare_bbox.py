#!/usr/bin/env python3
"""
Compare bbox calculations between temp (OpenPose JSON) and workers
"""
import json
import numpy as np
import sys
sys.path.insert(0, '/home/taekmin/S14P11D210/ai/shapy')

from regressor.human_shape.data.utils.bbox import keyps_to_bbox, bbox_to_center_scale

# Load temp's OpenPose JSON
json_path = '/home/taekmin/S14P11D210/ai/temp/ai/shapy/samples/openpose/images_keypoints.json'
with open(json_path, 'r') as f:
    data = json.load(f)

# Parse Body25 keypoints (pose_keypoints_2d is already in x,y,conf format)
pose_data = data['people'][0]['pose_keypoints_2d']
# Reshape to (25, 3)
body25_kps = np.array(pose_data).reshape(-1, 3)

print("=" * 60)
print("TEMP OpenPose JSON Analysis")
print("=" * 60)
print(f"Body25 keypoints shape: {body25_kps.shape}")
print(f"Keypoints with conf > 0: {(body25_kps[:, 2] > 0).sum()}")

# Apply same filtering as workers
body_thresh = 0.1
low_conf_mask = body25_kps[:, 2] < body_thresh
body25_kps_filtered = body25_kps.copy()
body25_kps_filtered[low_conf_mask, :] = 0.0

print(f"After filtering (conf >= {body_thresh}): {(body25_kps_filtered[:, 2] > 0).sum()}")

# Calculate bbox using Shapy utils (same as workers)
kps_2d = body25_kps_filtered[:, :2]
conf = body25_kps_filtered[:, 2]

# Assume image size - adjust if needed
img_w, img_h = 2816, 1536  # ACTUAL image size from visualization

bbox_xyxy = keyps_to_bbox(kps_2d, conf, img_size=(img_h, img_w, 3))
center, scale, bbox_size = bbox_to_center_scale(bbox_xyxy, dset_scale_factor=1.2)

print(f"\n📊 TEMP Calculation Results:")
print(f"  BBox (xyxy): {bbox_xyxy}")
print(f"  Center: {center}")
print(f"  Scale: {scale}")
print(f"  BBox Size: {bbox_size}")

print("\n" + "=" * 60)
print("WORKERS Output (from logs)")
print("=" * 60)
print("  BBox (xyxy): [1218.3, 196.15, 1599.7, 1393.4]")
print("  Center: [1409, 794.8]")
print("  Scale: 7.18370947265625")
print("  BBox Size: 1436.74189453125")

print("\n" + "=" * 60)
print("📈 COMPARISON")
print("=" * 60)
print(f"  Center diff: temp vs workers")
print(f"  BBox Size diff: temp vs workers")
print("\nIf values match, the problem is NOT in bbox calculation!")
print("If values differ, that's the root cause!")
