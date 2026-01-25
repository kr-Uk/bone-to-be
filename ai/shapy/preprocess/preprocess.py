import sys
import os

# [필수] 렌더링 에러 방지 (EGL 설정)
os.environ['PYOPENGL_PLATFORM'] = 'egl'

import os.path as osp
import glob
import time
import json
import argparse
from collections import defaultdict, OrderedDict
import numpy as np
import torch
import PIL.Image as pil_img
import torchvision.transforms as T
from tqdm import tqdm
import trimesh
from omegaconf import OmegaConf, DictConfig
from loguru import logger
import resource

# human_shape 라이브러리 모듈
from human_shape.config.defaults import conf as default_conf
from human_shape.models.build import build_model
from human_shape.data.structures.image_list import to_image_list
from human_shape.utils import Checkpointer, COLORS, HDRenderer

# 리소스 제한 해제
rlimit = resource.getrlimit(resource.RLIMIT_NOFILE)
resource.setrlimit(resource.RLIMIT_NOFILE, (rlimit[1], rlimit[1]))

class SimpleTarget:
    def __init__(self, img_path, width, height):
        self.fields = {}
        self.fields['filename'] = img_path
        self.fields['fname'] = os.path.basename(img_path)
        self.fields['orig_bbox_size'] = max(width, height)
        self.fields['orig_center'] = np.array([width / 2, height / 2])
        self.fields['img_size'] = (width, height)

    def get_field(self, key, default=None):
        return self.fields.get(key, default)
    
    def to(self, device):
        return self

def weak_persp_to_blender(targets, camera_scale, camera_transl, H, W, sensor_width=36, focal_length=5000):
    if torch.is_tensor(camera_scale): camera_scale = camera_scale.detach().cpu().numpy()
    if torch.is_tensor(camera_transl): camera_transl = camera_transl.detach().cpu().numpy()

    output = defaultdict(lambda: [])
    for ii, target in enumerate(targets):
        orig_bbox_size = target.get_field('orig_bbox_size')
        bbox_center = target.get_field('orig_center')
        z = 2 * focal_length / (camera_scale[ii] * orig_bbox_size)
        transl = [camera_transl[ii, 0].item(), camera_transl[ii, 1].item(), z.item()]
        shift_x = - (bbox_center[0] / W - 0.5)
        shift_y = (bbox_center[1] - 0.5 * H) / W
        output['shift_x'].append(shift_x)
        output['shift_y'].append(shift_y)
        output['transl'].append(transl)
        output['focal_length_in_mm'].append(focal_length / W * sensor_width)
        output['focal_length_in_px'].append(focal_length)
        output['center'].append(bbox_center)
        output['sensor_width'].append(sensor_width)
    for key in output: output[key] = np.array(output[key])
    return output

# Numpy/Tensor -> List 변환 (JSON 저장용)
def make_serializable(obj):
    if isinstance(obj, torch.Tensor):
        return obj.detach().cpu().numpy().tolist()
    elif isinstance(obj, np.ndarray):
        return obj.tolist()
    elif isinstance(obj, np.generic):
        return obj.item()
    return obj

# [핵심] 3D 관절 좌표를 이용한 신체 길이 계산 함수
def calculate_body_measurements(joints):
    """
    SMPL Joints 인덱스 기준 대략적인 길이 계산
    (단위는 모델의 scale에 따르며, 보통 미터 혹은 비율 단위임)
    """
    # SMPL Joint Indices (주요 관절)
    # 0: Pelvis(골반), 1: L_Hip, 2: R_Hip, 12: Neck
    # 16: L_Shoulder, 17: R_Shoulder, 18: L_Elbow, 19: R_Elbow, 20: L_Wrist, 21: R_Wrist
    # 4: L_Knee, 5: R_Knee, 7: L_Ankle, 8: R_Ankle, 15: Head
    
    def dist(idx1, idx2):
        return np.linalg.norm(joints[idx1] - joints[idx2]).item()

    measurements = {}
    
    # 1. 팔 길이 (어깨 -> 팔꿈치 -> 손목)
    measurements['left_arm_length'] = dist(16, 18) + dist(18, 20)
    measurements['right_arm_length'] = dist(17, 19) + dist(19, 21)
    
    # 2. 다리 길이 (골반 -> 무릎 -> 발목)
    measurements['left_leg_length'] = dist(1, 4) + dist(4, 7)
    measurements['right_leg_length'] = dist(2, 5) + dist(5, 8)
    
    # 3. 상체 길이 (골반 -> 목)
    measurements['torso_length'] = dist(0, 12)
    
    # 4. 어깨 너비 (좌우 어깨 직선 거리)
    measurements['shoulder_width'] = dist(16, 17)
    
    # 5. 골반 너비 (좌우 힙 직선 거리)
    measurements['hip_width'] = dist(1, 2)
    
    # 6. 목 길이 (목 -> 머리, 대략적)
    measurements['neck_length'] = dist(12, 15)

    return measurements

@torch.no_grad()
def main(args):
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    
    cfg = default_conf.copy()
    if args.exp_cfgs:
        for exp_cfg in args.exp_cfgs:
            if not os.path.exists(exp_cfg):
                logger.error(f"Config file not found: {exp_cfg}")
                sys.exit(1)
            cfg.merge_with(OmegaConf.load(exp_cfg))
    if args.exp_opts:
        cfg.merge_with(OmegaConf.from_cli(args.exp_opts))
    cfg.is_training = False
    
    final_output_folder = args.output_folder if args.output_folder else cfg.output_folder
    os.makedirs(final_output_folder, exist_ok=True)
    
    model_dict = build_model(cfg)
    model = model_dict['network'].to(device).eval()

    checkpoint_folder = osp.join(cfg.output_folder, cfg.checkpoint_folder)
    checkpointer = Checkpointer(model, save_dir=checkpoint_folder, pretrained=cfg.pretrained)
    checkpointer.load_checkpoint()

    crop_size = cfg.datasets.pose.transforms.crop_size
    mean = cfg.datasets.pose.transforms.mean
    std = cfg.datasets.pose.transforms.std
    
    transform = T.Compose([
        T.Resize((crop_size, crop_size)),
        T.ToTensor(),
        T.Normalize(mean=mean, std=std)
    ])
    
    hd_renderer = HDRenderer() if (args.save_vis) else None

    img_files = sorted(glob.glob(osp.join(args.input_folder, '*')))
    img_files = [f for f in img_files if f.lower().endswith(('.png', '.jpg', '.jpeg', '.bmp'))]
    
    if not img_files:
        logger.error(f"No images found in {args.input_folder}")
        sys.exit(1)
        
    logger.info(f"Processing {len(img_files)} images from {args.input_folder}")

    # [시간 측정용 변수]
    total_time = 0
    cnt = 0

    for img_path in tqdm(img_files):
        original_pil = pil_img.open(img_path).convert('RGB')
        W, H = original_pil.size
        
        body_tensor = transform(original_pil).unsqueeze(0).to(device)
        full_imgs = to_image_list(T.ToTensor()(original_pil).unsqueeze(0).to(device))
        target = SimpleTarget(img_path, W, H)
        
        # [추론 시작]
        torch.cuda.synchronize()
        start_time = time.perf_counter()
        
        # [Positional Argument 사용]
        model_output = model(body_tensor, 
                             [target], 
                             full_imgs=full_imgs,
                             device=device)
        
        torch.cuda.synchronize()
        elapsed = time.perf_counter() - start_time
        total_time += elapsed
        cnt += 1
        # [추론 종료]

        img_name = osp.splitext(osp.basename(img_path))[0]
        curr_out_path = osp.join(final_output_folder, img_name)
        os.makedirs(curr_out_path, exist_ok=True)
        
        stage_keys = model_output.get('stage_keys', [])
        
        # [JSON 데이터 생성 로직]
        # 가장 마지막 스테이지(보통 stage_02)가 최종 결과입니다.
        final_stage = stage_keys[-1] if stage_keys else None
        
        if final_stage:
            stage_out = model_output[final_stage]
            
            # 1. 3D 관절 좌표 추출 (배치 사이즈 1 가정이므로 0번째 인덱스)
            # joints key는 모델마다 다를 수 있으나 보통 'kp_3d' 혹은 'joints'에 저장됨
            # 여기서는 모델이 내부적으로 사용하는 3D Joint 위치를 가져옵니다.
            pred_joints = stage_out.get('kp_3d', stage_out.get('joints', None))
            
            # 2. Shape Parameter (Betas) 추출 - 골격 유형 분석에 중요
            pred_betas = stage_out.get('betas', None)
            
            # 3. 카메라 파라미터
            cam_params = model_output.get('camera_parameters', {})
            
            json_content = {
                "filename": img_name,
                "measured_lengths": {}, # 계산된 길이 정보
                "betas": [],           # 체형 파라미터
                "camera_params": {}
            }

            # 길이 계산
            if pred_joints is not None:
                joints_np = pred_joints.detach().cpu().numpy()[0] # (Num_Joints, 3)
                # 앞서 정의한 함수로 길이 계산
                measurements = calculate_body_measurements(joints_np)
                json_content["measured_lengths"] = measurements
                # 원본 관절 데이터도 필요하다면 저장 (분석용)
                # json_content["joints_3d"] = make_serializable(joints_np)

            if pred_betas is not None:
                json_content["betas"] = make_serializable(pred_betas[0])

            # JSON 파일 저장
            json_path = osp.join(curr_out_path, f'{img_name}_measurements.json')
            with open(json_path, 'w') as f:
                json.dump(json_content, f, indent=4)

        # [시각화 및 메쉬 저장]
        if args.save_vis:
            hd_imgs = np.transpose(full_imgs.images.detach().cpu().numpy().squeeze(), (1, 2, 0))
            bg_hd_imgs = np.transpose(hd_imgs, (2, 0, 1))[np.newaxis, ...]
            
            for stage_key in stage_keys:
                stage_out = model_output[stage_key]
                vertices = stage_out.get('vertices')
                if vertices is None: continue
                
                faces = stage_out['faces']
                vertices = vertices.detach().cpu().numpy()
                
                cam_params = model_output.get('camera_parameters', {})
                hd_params = weak_persp_to_blender(
                    [target], 
                    cam_params['scale'].detach(), 
                    cam_params['translation'].detach(), 
                    H, W
                )
                
                overlays = hd_renderer(
                    vertices, faces,
                    focal_length=hd_params['focal_length_in_px'],
                    camera_translation=hd_params['transl'],
                    camera_center=hd_params['center'],
                    bg_imgs=bg_hd_imgs,
                    return_with_alpha=True,
                    body_color=COLORS.get(stage_key, COLORS['default'])
                )
                
                vis_img = (np.clip(np.transpose(overlays[0], (1, 2, 0)), 0, 1) * 255).astype(np.uint8)
                pil_img.fromarray(vis_img).save(osp.join(curr_out_path, f'{stage_key}_overlay.png'))
                
                if args.save_mesh and stage_key == stage_keys[-1]:
                    mesh = trimesh.Trimesh(vertices[0] + hd_params['transl'][0], faces, process=False)
                    mesh.export(osp.join(curr_out_path, f'{img_name}.ply'))

    # [로그 출력] 평균 추론 시간
    if cnt > 0:
        logger.info(f'Average inference time: {total_time / cnt:.4f} seconds per image')

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--exp-cfg', nargs='+', required=True, dest='exp_cfgs')
    parser.add_argument('--input-folder', type=str, required=True)
    parser.add_argument('--output-folder', type=str, default='output')
    parser.add_argument('--save-vis', type=lambda x: x.lower() == 'true', default=True)
    parser.add_argument('--save-mesh', type=lambda x: x.lower() == 'true', default=False)
    parser.add_argument('--save-params', type=lambda x: x.lower() == 'true', default=False)
    parser.add_argument('--split', type=str, default='test')
    parser.add_argument('--datasets', type=str, default='')
    parser.add_argument('--exp-opts', nargs='*', default=[])
    
    args = parser.parse_args()
    main(args)