import sys
import os
import subprocess
import argparse
from loguru import logger

def main(args):
    # 경로 정규화 (끝에 붙은 / 제거 등) 및 절대 경로 변환
    input_folder = os.path.abspath(os.path.normpath(args.input_folder))
    output_folder = os.path.abspath(args.output_folder)
    checkpoint_path = os.path.abspath(args.checkpoint_path)
    config_path = os.path.abspath(args.exp_cfg)

    # ---------------------------------------------------------
    # 경로 계산 로직
    # ---------------------------------------------------------
    # 예: input_folder = /home/user/samples/images
    # parent_dir = /home/user/samples
    # openpose_folder = /home/user/samples/openpose
    
    parent_dir = os.path.dirname(input_folder)
    img_folder_name = os.path.basename(input_folder) # 'images'
    keyp_folder_name = 'openpose' # 우리가 생성할 폴더 이름
    
    # 실제 openpose 폴더 경로
    openpose_full_path = os.path.join(parent_dir, keyp_folder_name)

    # ---------------------------------------------------------
    # Step 1: YOLO11로 OpenPose JSON 생성 (openpose 폴더에 저장)
    # ---------------------------------------------------------
    logger.info(f"🚀 [Step 1/2] Generating OpenPose JSONs into '{keyp_folder_name}' folder...")
    
    cmd_yolo = [
        sys.executable, 'gen_openpose_yolo11.py',
        '--input-folder', input_folder,
        '--output-folder', openpose_full_path, # [핵심] 저장 위치 지정
        '--model-size', args.yolo_model
    ]

    try:
        subprocess.run(cmd_yolo, check=True)
    except subprocess.CalledProcessError:
        logger.error("❌ Step 1 (YOLO) failed.")
        sys.exit(1)

    # ---------------------------------------------------------
    # Step 2: SHAPY demo.py 실행
    # ---------------------------------------------------------
    logger.info("🚀 [Step 2/2] Running SHAPY Inference (demo.py)...")

    cmd_demo = [
        sys.executable, 'demo.py',
        '--save-vis', 'true',
        '--save-mesh', 'true',
        '--save-params', 'true',
        '--split', 'test',
        '--datasets', 'openpose',
        '--output-folder', output_folder,
        '--exp-cfg', config_path,
        '--exp-opts',
        f'output_folder={checkpoint_path}',
        'part_key=pose',
        # [핵심] 데이터 로더 경로 설정
        f'datasets.pose.openpose.data_folder={parent_dir}',  # 상위 폴더 (../samples)
        f'datasets.pose.openpose.img_folder={img_folder_name}', # 이미지 폴더명 (images)
        f'datasets.pose.openpose.keyp_folder={keyp_folder_name}', # 키포인트 폴더명 (openpose)
        'datasets.batch_size=1',
        'datasets.pose_shape_ratio=1.0'
    ]

    try:
        subprocess.run(cmd_demo, check=True)
        logger.info("✅ All processes completed successfully!")
        logger.info(f"📂 Results are saved in: {output_folder}")
    except subprocess.CalledProcessError:
        logger.error("❌ Step 2 (SHAPY) failed.")
        sys.exit(1)

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    
    parser.add_argument('--input-folder', type=str, required=True, 
                        help='Path to images (e.g., ../samples/images)')
    parser.add_argument('--output-folder', type=str, default='../samples/shapy_fit',
                        help='Where to save results')
    parser.add_argument('--yolo-model', type=str, default='x', choices=['n', 's', 'm', 'l', 'x'])
    parser.add_argument('--exp-cfg', type=str, default='configs/b2a_expose_hrnet_demo.yaml')
    parser.add_argument('--checkpoint-path', type=str, default='../data/trained_models/shapy/SHAPY_A')

    args = parser.parse_args()
    main(args)