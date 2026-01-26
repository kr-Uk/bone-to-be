#!/usr/bin/env python3
"""
Compare temp .npz output with workers response_dump.json
"""
import numpy as np
import json

# Load temp's output
temp_npz = np.load('/home/taekmin/S14P11D210/ai/temp/ai/shapy/regressor/test_result/한국여성.npz', allow_pickle=True)

print("=" * 80)
print("TEMP .npz Contents")
print("=" * 80)
print("Keys:", list(temp_npz.keys()))
print()

# Camera parameters
if 'camera' in temp_npz:
    temp_camera = temp_npz['camera']
    print(f"📷 Raw Camera: {temp_camera}")
    # Camera is usually [scale, tx, ty] for weak perspective
    if len(temp_camera) == 3:
        print(f"📷 Camera Scale: {temp_camera[0]}")
        print(f"📷 Camera Translation: [{temp_camera[1]}, {temp_camera[2]}]")
    
if 'scale' in temp_npz:
    temp_scale = temp_npz['scale']
    print(f"📷 Camera Scale (direct): {temp_scale}")
    
if 'translation' in temp_npz:
    temp_trans = temp_npz['translation']
    print(f"📷 Camera Translation (direct): {temp_trans}")

# BBox info
if 'orig_bbox_size' in temp_npz or 'bbox_size' in temp_npz:
    bbox_key = 'orig_bbox_size' if 'orig_bbox_size' in temp_npz else 'bbox_size'
    temp_bbox_size = temp_npz[bbox_key]
    print(f"📦 BBox Size: {temp_bbox_size}")

if 'orig_center' in temp_npz or 'center' in temp_npz:
    center_key = 'orig_center' if 'orig_center' in temp_npz else 'center'
    temp_center = temp_npz[center_key]
    print(f"📦 BBox Center: {temp_center}")

print("\n" + "=" * 80)
print("WORKERS response_dump.json")
print("=" * 80)

# Load workers output
with open('/home/taekmin/S14P11D210/ai/response_dump.json', 'r') as f:
    response = json.load(f)

# Get latest result (last item)
result = response['result']

# Camera parameters
cam_params = result.get('camera_parameters', {})
if cam_params:
    worker_scale = cam_params['scale'][0][0]
    worker_trans = cam_params['translation'][0]
    print(f"📷 Camera Scale: {worker_scale}")
    print(f"📷 Camera Translation: {worker_trans}")

# BBox metadata
bbox_meta = result.get('bbox_metadata', {})
if bbox_meta:
    worker_bbox_size = bbox_meta['bbox_size']
    worker_center = bbox_meta['center']
    print(f"📦 BBox Size: {worker_bbox_size}")
    print(f"📦 BBox Center: {worker_center}")

print("\n" + "=" * 80)
print("🔍 COMPARISON")
print("=" * 80)

if 'scale' in temp_npz and cam_params:
    scale_diff = abs(float(temp_scale) - worker_scale)
    print(f"Camera Scale Diff: {scale_diff:.6f}")
    if scale_diff > 0.01:
        print("  ⚠️ SIGNIFICANT DIFFERENCE in camera scale!")
    else:
        print("  ✅ Camera scales are similar")

if 'translation' in temp_npz and cam_params:
    trans_diff = np.linalg.norm(temp_trans - np.array(worker_trans))
    print(f"Camera Translation Diff (L2 norm): {trans_diff:.6f}")
    if trans_diff > 0.01:
        print("  ⚠️ SIGNIFICANT DIFFERENCE in camera translation!")
    else:
        print("  ✅ Camera translations are similar")

if bbox_meta:
    bbox_key = 'orig_bbox_size' if 'orig_bbox_size' in temp_npz else 'bbox_size'
    center_key = 'orig_center' if 'orig_center' in temp_npz else 'center'
    
    if bbox_key in temp_npz:
        bbox_diff = abs(float(temp_npz[bbox_key]) - worker_bbox_size)
        print(f"BBox Size Diff: {bbox_diff:.2f}")
        if bbox_diff > 10:
            print("  ⚠️ SIGNIFICANT DIFFERENCE in bbox size!")
        else:
            print("  ✅ BBox sizes are similar")
    
    if center_key in temp_npz:
        center_diff = np.linalg.norm(temp_npz[center_key] - np.array(worker_center))
        print(f"BBox Center Diff (L2 norm): {center_diff:.2f}")
        if center_diff > 10:
            print("  ⚠️ SIGNIFICANT DIFFERENCE in bbox center!")
        else:
            print("  ✅ BBox centers are similar")

print("\n" + "=" * 80)
print("💡 ANALYSIS")
print("=" * 80)
print("If camera parameters are different → Model predictions are different")
print("If bbox parameters are different → Input preprocessing is different")
print("If both are same but mesh still misaligned → Visualization bug")
