"""
Neck Length Diagnostic Script

Analyzes the neck length calculation issue where visual appearance doesn't match computed values.
"""

import json

# User's two measurements
measurement_1 = {
    "report_id": "skinny-2.png",
    "body_metrics": {
        "upper_body_depth_index": 0.1195788452768517,
        "waist_curvature_index": 12.786131858825684,
        "shoulder_width_index": 0.23948771830235704,
        "waist_length_index": 0.28246381878852844,
        "leg_length_index": 0.4745684564113617,
        "arm_torso_ratio": 1.1901839971542358,
        "shoulder_slope_angle": 38.41635073393901,
        "joint_thickness_index": 55.73747474939859,
        "neck_length_index": 0.12585055828094482  # 목이 길다 (측정치)
    },
    "status": "COMPLETED",
    "description": "목이 길고 사진으론 짧은 사람 - Long neck in measurement, short in visual"
}

measurement_2 = {
    "report_id": "skinny-2.png",
    "body_metrics": {
        "upper_body_depth_index": 0.1185335358377314,
        "waist_curvature_index": 12.179088592529297,
        "shoulder_width_index": 0.2219959498205031,
        "waist_length_index": 0.27039584517478943,
        "leg_length_index": 0.4967993199825287,
        "arm_torso_ratio": 1.2323555946350098,
        "shoulder_slope_angle": 43.462119396658345,
        "joint_thickness_index": 56.39557063559544,
        "neck_length_index": 0.11986707895994186  # 목이 짧다 (측정치)
    },
    "status": "COMPLETED",
    "description": "사진 상으론 더 목이 긴 사람 - Short neck in measurement, long in visual"
}

# Calculate absolute neck lengths (assuming height = 1.65m)
height = 1.65

m1_neck_abs = measurement_1["body_metrics"]["neck_length_index"] * height
m2_neck_abs = measurement_2["body_metrics"]["neck_length_index"] * height

print("=" * 70)
print("NECK LENGTH ANALYSIS")
print("=" * 70)
print()
print(f"Measurement 1: {measurement_1['description']}")
print(f"  - neck_length_index: {measurement_1['body_metrics']['neck_length_index']:.6f}")
print(f"  - Absolute neck length: {m1_neck_abs:.4f} m ({m1_neck_abs * 100:.2f} cm)")
print()
print(f"Measurement 2: {measurement_2['description']}")
print(f"  - neck_length_index: {measurement_2['body_metrics']['neck_length_index']:.6f}")
print(f"  - Absolute neck length: {m2_neck_abs:.4f} m ({m2_neck_abs * 100:.2f} cm)")
print()
print("=" * 70)
print("COMPARISON")
print("=" * 70)
diff_index = measurement_1['body_metrics']['neck_length_index'] - measurement_2['body_metrics']['neck_length_index']
diff_abs = m1_neck_abs - m2_neck_abs

print(f"Difference in neck_length_index: {diff_index:.6f}")
print(f"Difference in absolute length: {diff_abs:.4f} m ({diff_abs * 100:.2f} cm)")
print()
print("ISSUE:")
print("  Measurement  1 has HIGHER neck_length_index but visually SHORTER neck")
print("  Measurement 2 has LOWER neck_length_index but visually LONGER neck")
print()
print("=" * 70)
print("OTHER METRIC DIFFERENCES (to find patterns)")
print("=" * 70)

metrics = measurement_1["body_metrics"].keys()
for metric in metrics:
    v1 = measurement_1["body_metrics"][metric]
    v2 = measurement_2["body_metrics"][metric]
    diff = v1 - v2
    print(f"{metric:30s}: M1={v1:8.4f}  M2={v2:8.4f}  Diff={diff:+8.4f}")

print()
print("=" * 70)
print("HYPOTHESIS")
print("=" * 70)
print("""
Possible causes:
1. Joint Detection Issue: SMPL-X head or neck joint position is incorrectly estimated
2. Pose Dependency: Head tilt or chin position affects head joint Y-coordinate
3. Body Proportion Confusion: The measurements might be from different people/sessions
4. Measurement Reference: Using wrong joint indices for head/neck

Recommended Solutions:
1. Verify the SMPL-X joint positions are correctly mapped
2. Use mesh-based neck measurement instead of joints (similar to shoulder width)
3. Add chin/jaw landmark detection to get more accurate head bottom position
4. Check if head joint (15) is at top of skull vs. face center
""")
