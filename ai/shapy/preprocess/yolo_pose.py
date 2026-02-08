import os
import json
import glob
import numpy as np
import argparse
from tqdm import tqdm
from ultralytics import YOLO

def yolo_to_openpose_body25(yolo_kps):
    """
    YOLO(COCO-17) 포맷을 OpenPose(Body_25) 포맷으로 변환합니다.
    
    YOLO Indices:
    0:Nose, 1:LEye, 2:REye, 3:LEar, 4:REar, 
    5:LSh, 6:RSh, 7:LElb, 8:RElb, 9:LWri, 10:RWri, 
    11:LHip, 12:RHip, 13:LKnee, 14:RKnee, 15:LAnk, 16:RAnk
    
    OpenPose Body_25 Indices:
    0:Nose, 1:Neck, 2:RSh, 3:RElb, 4:RWri, 5:LSh, 6:LElb, 7:LWri, 
    8:MidHip, 9:RHip, 10:RKnee, 11:RAnk, 12:LHip, 13:LKnee, 14:LAnk, 
    15:REye, 16:LEye, 17:REar, 18:LEar, 19:LBigToe, 20:LSmallToe, 21:LHeel, 
    22:RBigToe, 23:RSmallToe, 24:RHeel
    """
    # (17, 3) 형태의 입력 가정
    op_kps = np.zeros((25, 3), dtype=np.float32)
    
    # 1. 직접 매핑 가능한 관절들
    op_kps[0] = yolo_kps[0]   # Nose
    op_kps[2] = yolo_kps[6]   # RSh
    op_kps[3] = yolo_kps[8]   # RElb
    op_kps[4] = yolo_kps[10]  # RWri
    op_kps[5] = yolo_kps[5]   # LSh
    op_kps[6] = yolo_kps[7]   # LElb
    op_kps[7] = yolo_kps[9]   # LWri
    op_kps[9] = yolo_kps[12]  # RHip
    op_kps[10] = yolo_kps[14] # RKnee
    op_kps[11] = yolo_kps[16] # RAnk
    op_kps[12] = yolo_kps[11] # LHip
    op_kps[13] = yolo_kps[13] # LKnee
    op_kps[14] = yolo_kps[15] # LAnk
    op_kps[15] = yolo_kps[2]  # REye
    op_kps[16] = yolo_kps[1]  # LEye
    op_kps[17] = yolo_kps[4]  # REar
    op_kps[18] = yolo_kps[3]  # LEar
    
    # 2. 계산이 필요한 관절들 (Neck, MidHip)
    # Neck = Average of Shoulders (LSh:5, RSh:6)
    if yolo_kps[5, 2] > 0 and yolo_kps[6, 2] > 0:
        op_kps[1] = (yolo_kps[5] + yolo_kps[6]) / 2.0
    
    # MidHip = Average of Hips (LHip:11, RHip:12)
    if yolo_kps[11, 2] > 0 and yolo_kps[12, 2] > 0:
        op_kps[8] = (yolo_kps[11] + yolo_kps[12]) / 2.0
        
    # 3. 발(Toe/Heel) 데이터는 YOLO에 없으므로 0.0 유지
    
    return op_kps.flatten().tolist()

def main(args):
    print(f"Loading YOLO11-Pose model ({args.model_size})...")
    model_name = f'yolo11{args.model_size}-pose.pt'
    model = YOLO(model_name)

    img_exts = ['*.jpg', '*.jpeg', '*.png', '*.bmp']
    img_files = []
    for ext in img_exts:
        img_files.extend(glob.glob(os.path.join(args.input_folder, ext)))
    img_files = sorted(img_files)

    if not img_files:
        print(f"No images found in {args.input_folder}")
        return

    os.makedirs(args.output_folder, exist_ok=True)
    print(f"Processing {len(img_files)} images...")
    print(f"Saving converted JSONs to: {args.output_folder}")

    for img_path in tqdm(img_files):
        results = model(img_path, verbose=False, classes=[0], conf=0.5)
        
        if not results or len(results[0].keypoints) == 0:
            continue

        # YOLO Keypoints (17, 3)
        keypoints = results[0].keypoints.data[0].cpu().numpy() 
        
        # [핵심] YOLO(17) -> Body_25(25) 변환
        pose_keypoints_2d = yolo_to_openpose_body25(keypoints)

        # [필수] Dummy Data 패딩 (Face & Hand)
        # Face: 70 points * 3 = 210
        face_keypoints_2d = [0.0] * 210
        # Hand: 21 points * 3 = 63
        hand_left_keypoints_2d = [0.0] * 63
        hand_right_keypoints_2d = [0.0] * 63

        openpose_dict = {
            "version": 1.3,
            "people": [
                {
                    "person_id": [-1],
                    "pose_keypoints_2d": pose_keypoints_2d,
                    "face_keypoints_2d": face_keypoints_2d,
                    "hand_left_keypoints_2d": hand_left_keypoints_2d,
                    "hand_right_keypoints_2d": hand_right_keypoints_2d,
                    "pose_keypoints_3d": [],
                    "face_keypoints_3d": [],
                    "hand_left_keypoints_3d": [],
                    "hand_right_keypoints_3d": []
                }
            ]
        }

        base_name = os.path.splitext(os.path.basename(img_path))[0]
        json_filename = f"{base_name}_keypoints.json"
        json_path = os.path.join(args.output_folder, json_filename)
        
        with open(json_path, 'w') as f:
            json.dump(openpose_dict, f)

    print("Done! Converted OpenPose JSON files generated.")

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--input-folder', type=str, required=True, help='Path to image folder')
    parser.add_argument('--output-folder', type=str, required=True, help='Path to save JSON files')
    parser.add_argument('--model-size', type=str, default='m', choices=['n', 's', 'm', 'l', 'x'])
    args = parser.parse_args()
    main(args)