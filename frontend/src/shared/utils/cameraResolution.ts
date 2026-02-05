/**
 * Camera Resolution Detection and Optimization Utility
 *
 * Purpose: Detect the native resolution of the user's camera and calculate
 * optimal canvas dimensions for MediaPipe Pose detection.
 *
 * This ensures accurate body proportion measurement by:
 * 1. Requesting camera at highest resolution (ideal: 1920×1080)
 * 2. Detecting actual camera capabilities
 * 3. Calculating optimal dimensions while maintaining aspect ratio
 */

export interface OptimalDimensions {
  width: number;
  height: number;
  aspectRatio: number;
  nativeWidth: number;
  nativeHeight: number;
}

const MAX_CANVAS_WIDTH = 400; // Display constraint

/**
 * Detects camera's native resolution and calculates optimal canvas dimensions
 *
 * @returns {Promise<OptimalDimensions>} Optimal dimensions for canvas
 * @throws {Error} If camera access is denied or getUserMedia is not supported
 */
export async function detectAndCalculateOptimalDimensions(): Promise<OptimalDimensions> {
  try {
    // Request temporary camera access for detection at maximum resolution
    // Using ideal: 1920x1080 to detect webcam's true max resolution
    // This ensures accurate aspect ratio for body proportion measurement
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 1920 },
        height: { ideal: 1080 },
      },
    });

    // Get actual resolution from video track
    const track = stream.getVideoTracks()[0];
    const settings = track.getSettings();

    const nativeWidth = settings.width || 640;
    const nativeHeight = settings.height || 480;

    // Stop all tracks to release camera resource completely
    stream.getTracks().forEach((t) => t.stop());

    console.log(`[cameraResolution] Native (max): ${nativeWidth}×${nativeHeight}`);

    // Calculate optimal canvas dimensions
    const aspectRatio = nativeWidth / nativeHeight;
    const width = MAX_CANVAS_WIDTH;
    const height = Math.round(width / aspectRatio);

    console.log(`[cameraResolution] Optimal: ${width}×${height} (${aspectRatio.toFixed(2)})`);

    // Wait a bit to ensure camera resource is fully released
    // This prevents "Device in use" error when MediaPipe Camera tries to access it
    await new Promise((resolve) => setTimeout(resolve, 200));

    console.log("[cameraResolution] Camera resource released");

    return {
      width,
      height,
      aspectRatio,
      nativeWidth,
      nativeHeight,
    };
  } catch (error) {
    console.error("[cameraResolution] Detection failed:", error);

    // Fallback to default 4:3 dimensions
    return {
      width: 400,
      height: 300,
      aspectRatio: 4 / 3,
      nativeWidth: 640,
      nativeHeight: 480,
    };
  }
}
