import torch
from omegaconf import OmegaConf
from human_shape.config.defaults import conf as default_conf
from human_shape.models.build import build_model
from human_shape.utils import Checkpointer


class ShapyModel:

    def __init__(self, exp_cfg_path: str):
        self.device = torch.device("cuda")

        cfg = default_conf.copy()
        cfg.merge_with(OmegaConf.load(exp_cfg_path))
        cfg.is_training = False

        model_dict = build_model(cfg)
        model = model_dict["network"]
        model = model.to(self.device)
        model.eval()

        checkpoint_folder = cfg.output_folder + "/" + cfg.checkpoint_folder
        checkpointer = Checkpointer(
            model,
            save_dir=checkpoint_folder,
            pretrained=cfg.pretrained
        )
        checkpointer.load_checkpoint()

        self.model = model
        self.cfg = cfg

        print("✅ SHAPY model loaded")

    @torch.no_grad()
    def infer(self, body_imgs, body_targets, full_imgs=None):
        return self.model(
            body_imgs,
            body_targets,
            full_imgs=full_imgs,
            device=self.device
        )
