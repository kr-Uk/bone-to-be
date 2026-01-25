# shapy/runner.py

from shapy.model_loader import load_model


def analyze(image_path: str):
    model, cfg, device = load_model(
        "/app/configs/shapy.yaml"
    )

    body_tensor, target, full_imgs = preprocess_image(
        image_path, cfg, device
    )

    output = model(
        body_tensor,
        [target],
        full_imgs=full_imgs,
        device=device
    )

    return parse_output(output)
