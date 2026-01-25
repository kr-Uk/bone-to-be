import torch
from shapy.model_loader import ShapyModel
from shapy.preprocess import preprocess_image   # 네 기존 로직

# 🔥 전역 singleton
_model = None


def get_model():
    global _model
    if _model is None:
        _model = ShapyModel(
            exp_cfg_path="configs/shapy.yaml"
        )
    return _model


def analyze(image_path: str) -> dict:
    model = get_model()

    body_imgs, body_targets, full_imgs = preprocess_image(
        image_path,
        model.cfg
    )

    output = model.infer(
        body_imgs=body_imgs,
        body_targets=body_targets,
        full_imgs=full_imgs
    )

    return {
        "vertices": output["stage_02"]["vertices"],
        "camera": output["camera_parameters"]
    }
