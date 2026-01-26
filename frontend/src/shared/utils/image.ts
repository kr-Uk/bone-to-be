/**
 * Data URL을 Blob으로 변환
 * @param dataURL - base64 인코딩된 데이터 URL
 * @returns Blob 객체
 */
export function dataURLtoBlob(dataURL: string): Blob {
  const arr = dataURL.split(",");
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : "image/jpeg";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new Blob([u8arr], { type: mime });
}

/**
 * 고유한 파일명 생성
 * @param prefix - 파일명 접두사
 * @param extension - 파일 확장자 (예: 'jpg', 'png')
 * @returns 고유한 파일명
 */
export function generateFilename(prefix: string, extension: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  return `${prefix}-${timestamp}-${random}.${extension}`;
}

/**
 * 이미지 압축
 * @param imageDataUrl - 원본 이미지 데이터 URL
 * @param maxWidth - 최대 너비 (기본값: 1920)
 * @param quality - 이미지 품질 0-1 (기본값: 0.8)
 * @returns 압축된 이미지 데이터 URL
 */
export function compressImage(
  imageDataUrl: string,
  maxWidth: number = 1920,
  quality: number = 0.8,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement("canvas");
      let width = img.width;
      let height = img.height;

      // 최대 너비를 초과하면 비율에 맞춰 리사이즈
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas context를 가져올 수 없습니다."));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      // JPEG로 압축
      const compressedDataUrl = canvas.toDataURL("image/jpeg", quality);
      resolve(compressedDataUrl);
    };

    img.onerror = () => {
      reject(new Error("이미지를 불러올 수 없습니다."));
    };

    img.src = imageDataUrl;
  });
}
