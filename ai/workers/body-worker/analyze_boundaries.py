
import json
import os
import sys

# Encoding safety
sys.stdout.reconfigure(encoding='utf-8')

def extract_label(filename):
    # Filename format: "8. straight-natural.jpg" -> "straight-natural"
    try:
        # Remove extension
        name = os.path.splitext(filename)[0]
        # Remove numbering "8. "
        if '. ' in name:
            parts = name.split('. ', 1)
            if len(parts) > 1:
                return parts[1].strip()
        return name.strip()
    except:
        return filename

def main():
    try:
        with open('test_results.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
    except FileNotFoundError:
        print("Error: test_results.json not found.")
        return

    metrics_order = [
        'shoulder_slope_angle',
        'shoulder_width_index',
        'hip_width_index',
        'shoulder_hip_ratio',
        'upper_body_depth_index',
        'waist_length_index',
        'waist_curvature_index',
        'joint_thickness_index',
        'arm_torso_ratio',
        'linearity_index',
        'leg_length_index'
    ]

    display_names = {
        'shoulder_slope_angle': '1. Shoulder Slope Angle (어깨 기울기)',
        'shoulder_width_index': '2. Shoulder Width Index (어깨 너비)',
        'hip_width_index': '3. Hip Width Index (골반 너비)',
        'shoulder_hip_ratio': '4. Shoulder-Hip Ratio (어깨/골반 비율)',
        'upper_body_depth_index': '5. Upper Body Depth Index (상체 두께)',
        'waist_length_index': '6. Waist Length Index (허리 길이)',
        'waist_curvature_index': '7. Waist Curvature Index (허리 굴곡)',
        'joint_thickness_index': '8. Joint Thickness Index (관절 두께)',
        'arm_torso_ratio': '9. Arm-Torso Ratio (팔/상체 비율)',
        'linearity_index': '10. Linearity Index (직선성)',
        'leg_length_index': '11. Leg Length Index (다리 길이)'
    }

    md_lines = []
    md_lines.append('# Metric Distribution & Boundary Analysis')
    md_lines.append('> **Boundary Logic**: "Hybrid" filenames (e.g., straight-natural) represent transition ranges. Their Min/Max values indicate the boundaries for that body type mix.\n')

    for metric_key in metrics_order:
        metric_name = display_names.get(metric_key, metric_key)
        md_lines.append(f'## {metric_name}')
        
        # 1. Collect Data
        items = []
        for d in data:
            val = d['body_metrics'].get(metric_key, 0)
            rid = d['report_id']
            label = extract_label(rid)
            items.append({'id': rid, 'val': val, 'label': label})
        
        # 2. Sort by Value
        items.sort(key=lambda x: x['val'])
        
        # 3. Group by Label using the pre-extracted label
        groups = {}
        for item in items:
            lbl = item['label']
            if lbl not in groups:
                groups[lbl] = []
            groups[lbl].append(item['val'])
        
        # Calculate stats for groups
        group_stats = []
        for lbl, vals in groups.items():
            group_stats.append({
                'label': lbl, 
                'min': min(vals), 
                'max': max(vals), 
                'avg': sum(vals)/len(vals),
                'count': len(vals)
            })
        
        # Sort groups by their AVG value to see the progression
        group_stats.sort(key=lambda x: x['avg'])

        # 4. Generate Summary Table (The "Boundaries")
        md_lines.append('### Type Groups (Boundaries)')
        md_lines.append('| Body Type (Label) | Min (Left) | Avg | Max (Right) | Count |')
        md_lines.append('| :--- | :--- | :--- | :--- | :--- |')
        
        for g in group_stats:
            # Highlight pure types if any, or just list them
            md_lines.append(f"| **{g['label']}** | {g['min']:.4f} | {g['avg']:.4f} | {g['max']:.4f} | {g['count']} |")
        
        md_lines.append('\n')

        # 5. Generate Full Sorted Table
        md_lines.append('### Full Sorted Data')
        md_lines.append('| Rank | Value | Filename |')
        md_lines.append('| :--- | :--- | :--- |')
        for i, item in enumerate(items):
            md_lines.append(f"| {i+1} | **{item['val']:.4f}** | `{item['id']}` |")
            
        md_lines.append('\n---\n')

    # Write to file
    out_path = 'metric_distribution.md'
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(md_lines))
    
    print(f"Successfully generated {out_path}")

if __name__ == "__main__":
    main()
