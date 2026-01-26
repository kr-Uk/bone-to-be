import json
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D
import numpy as np
import os

def visualize_json(json_path="response_dump.json", output_image="visualization.png"):
    if not os.path.exists(json_path):
        print(f"File not found: {json_path}")
        return

    with open(json_path, 'r') as f:
        data = json.load(f)

    # Extract result
    result = data.get("result", {})
    
    # Check for stages (stage_02 is usually the final one in iterative regressors)
    # Or sometimes it's directly in result
    if "stage_02" in result:
        body_data = result["stage_02"]
    elif "joints" in result: # distinct case
        body_data = result
    else:
        # Try to find the last stage keys
        keys = sorted([k for k in result.keys() if k.startswith("stage_")])
        if keys:
            body_data = result[keys[-1]]
        else:
            print("Could not find body data (joints/vertices) in result.")
            print(f"Available keys: {list(result.keys())}")
            return

    joints = np.array(body_data.get("joints", []))
    vertices = np.array(body_data.get("vertices", []))

    # Handle batch dimension if present (1, N, 3) -> (N, 3)
    if joints.ndim == 3:
        joints = joints[0]
    if vertices.ndim == 3:
        vertices = vertices[0]
    
    print(f"Joints shape: {joints.shape}")
    print(f"Vertices shape: {vertices.shape}")

    # Helper to set equal aspect ratio for 3D plots
    def set_axes_equal(ax):
        x_limits = ax.get_xlim3d()
        y_limits = ax.get_ylim3d()
        z_limits = ax.get_zlim3d()

        x_range = abs(x_limits[1] - x_limits[0])
        x_middle = np.mean(x_limits)
        y_range = abs(y_limits[1] - y_limits[0])
        y_middle = np.mean(y_limits)
        z_range = abs(z_limits[1] - z_limits[0])
        z_middle = np.mean(z_limits)

        plot_radius = 0.5 * max([x_range, y_range, z_range])

        ax.set_xlim3d([x_middle - plot_radius, x_middle + plot_radius])
        ax.set_ylim3d([y_middle - plot_radius, y_middle + plot_radius])
        ax.set_zlim3d([z_middle - plot_radius, z_middle + plot_radius])
        
        # SMPL Coordinate system check:
        # Usually: x=right, y=up, z=forward (or variations)
        # Often inverted in plotting libraries.
        # Let's verify by inverting Y if it looks upside down.
        # ax.invert_yaxis() # Uncomment if upside down

    fig = plt.figure(figsize=(12, 6))

    # Plot 1: Joints 3D
    ax1 = fig.add_subplot(121, projection='3d')
    ax1.scatter(joints[:, 0], joints[:, 1], joints[:, 2], c='red', marker='o', s=20, label='Joints')
    ax1.set_title("3D Joints")
    ax1.set_xlabel("X")
    ax1.set_ylabel("Y")
    ax1.set_zlabel("Z")
    set_axes_equal(ax1)
    
    # Plot 2: Vertices 3D
    ax2 = fig.add_subplot(122, projection='3d')
    if len(vertices) > 0:
        step = max(1, len(vertices) // 2000) 
        sub_verts = vertices[::step]
        ax2.scatter(sub_verts[:, 0], sub_verts[:, 1], sub_verts[:, 2], c='blue', marker='.', s=1, alpha=0.5, label='Vertices')
    
    ax2.set_title(f"3D Vertices (Subsampled 1/{step})")
    ax2.set_xlabel("X")
    ax2.set_ylabel("Y")
    ax2.set_zlabel("Z")
    ax2.view_init(elev=-90, azim=-90) # Typical top-down correction for some SMPL coords
    set_axes_equal(ax2)

    # Save
    plt.tight_layout()
    plt.savefig(output_image)
    print(f"✅ Visualization saved to {output_image}")

if __name__ == "__main__":
    visualize_json()
