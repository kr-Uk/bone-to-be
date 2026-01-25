import os
import sys
import threading
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

import resource
import torch
from omegaconf import DictConfig, OmegaConf


@dataclass(frozen=True)
class ShapyRuntimeConfig:
    """런타임에 runner/preprocess가 참고할 수 있는 최소 캐시 값들."""
    part_key: str
    crop_size: int
    mean: Tuple[float, float, float]
    std: Tuple[float, float, float]


class ShapyModelLoader:
    """
    SHAPY 모델을 프로세스당 1회만 로딩해서 재사용하는 singleton 로더.

    demo.py 로딩 흐름을 그대로 따른다:
    - default_conf.copy()
    - OmegaConf.load(exp_cfg) merge
    - OmegaConf.from_cli(exp_opts) merge
    - build_model(cfg) -> model_dict['network']
    - model.to(cuda), eval()
    - Checkpointer.load_checkpoint()
    """

    _instance: Optional["ShapyModelLoader"] = None
    _lock = threading.Lock()

    def __init__(
        self,
        exp_cfg_paths: List[str],
        exp_opts: Optional[List[str]] = None,
        device: str = "cuda",
    ) -> None:
        self._exp_cfg_paths = exp_cfg_paths
        self._exp_opts = exp_opts or []
        self._device_str = device

        self._loaded = False
        self._cfg: Optional[DictConfig] = None
        self._model: Optional[torch.nn.Module] = None
        self._device: Optional[torch.device] = None
        self._rt: Optional[ShapyRuntimeConfig] = None

    # ----------------------------
    # Singleton access
    # ----------------------------
    @classmethod
    def get_instance(
        cls,
        exp_cfg_paths: List[str],
        exp_opts: Optional[List[str]] = None,
        device: str = "cuda",
    ) -> "ShapyModelLoader":
        with cls._lock:
            if cls._instance is None:
                cls._instance = cls(exp_cfg_paths=exp_cfg_paths, exp_opts=exp_opts, device=device)
            return cls._instance

    # ----------------------------
    # Public getters
    # ----------------------------
    @property
    def cfg(self) -> DictConfig:
        if not self._loaded or self._cfg is None:
            raise RuntimeError("SHAPY model is not loaded yet. Call load() first.")
        return self._cfg

    @property
    def model(self) -> torch.nn.Module:
        if not self._loaded or self._model is None:
            raise RuntimeError("SHAPY model is not loaded yet. Call load() first.")
        return self._model

    @property
    def device(self) -> torch.device:
        if not self._loaded or self._device is None:
            raise RuntimeError("SHAPY model is not loaded yet. Call load() first.")
        return self._device

    @property
    def runtime(self) -> ShapyRuntimeConfig:
        if not self._loaded or self._rt is None:
            raise RuntimeError("SHAPY model is not loaded yet. Call load() first.")
        return self._rt

    # ----------------------------
    # Load (idempotent)
    # ----------------------------
    def load(self) -> None:
        """
        프로세스 시작 시 1회 호출.
        이미 로딩되어 있으면 no-op.
        """
        if self._loaded:
            return

        with self._lock:
            if self._loaded:
                return

            self._setup_environment()
            self._setup_pythonpath()

            # 여기서부터는 sys.path가 정리된 상태여야 import가 안전함
            from regressor.human_shape.config.defaults import conf as default_conf
            from regressor.human_shape.models.build import build_model
            from regressor.human_shape.utils import Checkpointer

            device = self._resolve_device(self._device_str)

            # demo.py: cfg = default_conf.copy()
            cfg = default_conf.copy()

            # demo.py: for exp_cfg in cmd_args.exp_cfgs: cfg.merge_with(OmegaConf.load(exp_cfg))
            for p in self._exp_cfg_paths:
                cfg.merge_with(OmegaConf.load(p))

            # demo.py: if cmd_args.exp_opts: cfg.merge_with(OmegaConf.from_cli(cmd_args.exp_opts))
            if self._exp_opts:
                cfg.merge_with(OmegaConf.from_cli(self._exp_opts))

            cfg.is_training = False  # demo.py 동일

            # demo.py: model_dict = build_model(exp_cfg); model = model_dict['network']
            model_dict: Dict[str, Any] = build_model(cfg)
            model: torch.nn.Module = model_dict["network"]

            # demo.py: model = model.to(device=device)
            model = model.to(device=device)

            # demo.py: checkpoint_folder = output_folder / cfg.checkpoint_folder
            output_folder = os.path.expandvars(str(cfg.output_folder))
            checkpoint_folder = os.path.join(output_folder, str(cfg.checkpoint_folder))
            os.makedirs(checkpoint_folder, exist_ok=True)

            # demo.py: checkpointer = Checkpointer(model, save_dir=checkpoint_folder, pretrained=cfg.pretrained)
            checkpointer = Checkpointer(model, save_dir=checkpoint_folder, pretrained=cfg.pretrained)

            # demo.py: extra_checkpoint_data = checkpointer.load_checkpoint()
            _ = checkpointer.load_checkpoint()

            model.eval()

            # demo.py: mean/std/crop_size는 datasets.pose.transforms에서 읽음
            part_key = cfg.get("part_key", "pose")
            transf_cfg = cfg.get("datasets", {}).get(part_key, {}).get("transforms", {})
            mean = tuple(transf_cfg.get("mean", (0.485, 0.456, 0.406)))
            std = tuple(transf_cfg.get("std", (0.229, 0.224, 0.225)))
            crop_size = int(transf_cfg.get("crop_size", 224))

            self._cfg = cfg
            self._model = model
            self._device = device
            self._rt = ShapyRuntimeConfig(
                part_key=part_key,
                crop_size=crop_size,
                mean=(float(mean[0]), float(mean[1]), float(mean[2])),
                std=(float(std[0]), float(std[1]), float(std[2])),
            )
            self._loaded = True

    # ----------------------------
    # Internals
    # ----------------------------
    def _setup_environment(self) -> None:
        # demo.py: os.environ['PYOPENGL_PLATFORM'] = 'egl'
        os.environ.setdefault("PYOPENGL_PLATFORM", "egl")

        # demo.py: resource.setrlimit(RLIMIT_NOFILE, (rlimit[1], rlimit[1]))
        rlimit = resource.getrlimit(resource.RLIMIT_NOFILE)
        try:
            resource.setrlimit(resource.RLIMIT_NOFILE, (rlimit[1], rlimit[1]))
        except Exception:
            # 일부 환경에서 권한/제한으로 실패할 수 있으나, 로딩 자체를 막을 필요는 없음
            pass

        # demo.py __main__ flags
        torch.backends.cudnn.benchmark = True
        torch.backends.cudnn.deterministic = False

    def _setup_pythonpath(self) -> None:
        """
        현재 프로젝트 구조(shapy 아래에 regressor, measurements, attributes...)에서
        SHAPY가 기대하는 top-level import를 만족시키기 위한 sys.path 강제 주입.

        현재 확인된 구조:
        ai/shapy/
          - regressor/ (human_shape가 여기 존재)
          - measurements/ (body_measurements.py 등)
          - attributes/
          - preprocess/
        """
        shapy_root = Path(__file__).resolve().parent            # .../ai/shapy
        regressor_root = shapy_root              # .../ai/shapy/regressor

        # human_shape 패키지는 regressor 아래에 있으므로 regressor_root가 필요
        self._sys_path_insert(str(regressor_root))

        # SHAPY의 top-level import 대응(예: import body_measurements)
        self._sys_path_insert(str(shapy_root))
        self._sys_path_insert(str(shapy_root / "measurements"))
        self._sys_path_insert(str(shapy_root / "attributes"))
        self._sys_path_insert(str(shapy_root / "preprocess"))

    def _sys_path_insert(self, p: str) -> None:
        if p not in sys.path:
            sys.path.insert(0, p)

    def _resolve_device(self, device_str: str) -> torch.device:
        if device_str.startswith("cuda"):
            if not torch.cuda.is_available():
                raise RuntimeError("CUDA is not available, but device='cuda' was requested.")
            return torch.device(device_str)
        return torch.device(device_str)


def load_shapy_singleton(
    exp_cfg_path: str = "regressor/configs/b2a_expose_hrnet_demo.yaml",
    exp_opts: Optional[List[str]] = None,
    device: str = "cuda",
) -> ShapyModelLoader:
    """
    편의 함수.
    보통 worker 시작 시 여기 한 번 호출해서 로딩 완료 상태로 만든다.
    """
    # model_loader.py는 shapy/에 있으므로 exp_cfg는 regressor 기준으로 맞춰야 함
    # => 기본값은 regressor/configs/.. 로 맞춘다.
    shapy_root = Path(__file__).resolve().parent
    regressor_root = shapy_root
    cfg_abs = str((regressor_root / exp_cfg_path).resolve()) if not os.path.isabs(exp_cfg_path) else exp_cfg_path

    loader = ShapyModelLoader.get_instance(exp_cfg_paths=[cfg_abs], exp_opts=exp_opts, device=device)
    loader.load()
    return loader
