import { POSE_CONNECTIONS, type Results } from "@mediapipe/pose";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";

type DrawPoseOptions = {
  canvas: HTMLCanvasElement;
  results: Results;
  isDebugMode?: boolean;
  drawImage?: boolean;
  width?: number;
  height?: number;
};

const getImageSize = (image: Results["image"]) => {
  if ("videoWidth" in image && "videoHeight" in image) {
    return { width: image.videoWidth, height: image.videoHeight };
  }

  return { width: image.width, height: image.height };
};

export const drawPoseResults = ({
  canvas,
  results,
  isDebugMode = false,
  drawImage = true,
  width,
  height,
}: DrawPoseOptions) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const clientWidth = canvas.clientWidth;
  const clientHeight = canvas.clientHeight;
  const imageSize = getImageSize(results.image);
  const targetWidth = width ?? clientWidth ?? imageSize.width;
  const targetHeight = height ?? clientHeight ?? imageSize.height;

  if (!targetWidth || !targetHeight) return;

  if (canvas.width !== targetWidth) canvas.width = targetWidth;
  if (canvas.height !== targetHeight) canvas.height = targetHeight;

  ctx.save();
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (drawImage) {
    ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
  }

  if (isDebugMode && results.poseLandmarks) {
    drawConnectors(ctx, results.poseLandmarks, POSE_CONNECTIONS, {
      color: "#00FF00",
      lineWidth: 2,
    });

    drawLandmarks(ctx, results.poseLandmarks, {
      color: "#FF0000",
      lineWidth: 1,
      radius: 3,
    });
  }

  ctx.restore();
};
