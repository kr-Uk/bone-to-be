import { useCallback, useRef, useState } from "react";

import * as S from "./FeedImageUpload.styles";

import type { FeedImageUploadProps } from "./types";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ["image/svg+xml", "image/png", "image/jpeg"];

export function FeedImageUpload({ imagePreview, onImageChange }: FeedImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);

  const validateFile = useCallback((file: File): boolean => {
    setError(null);

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("SVG, PNG, JPG 파일만 업로드할 수 있습니다.");
      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("10MB 이하의 이미지 파일만 업로드할 수 있습니다.");
      return false;
    }

    return true;
  }, []);

  const handleFileChange = useCallback(
    (file: File) => {
      if (validateFile(file)) {
        setImageLoading(true);
        onImageChange(file);
      }
    },
    [validateFile, onImageChange],
  );

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFileChange(file);
      }
    },
    [handleFileChange],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const file = e.dataTransfer.files?.[0];
      if (file) {
        handleFileChange(file);
      }
    },
    [handleFileChange],
  );

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleRemove = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onImageChange(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [onImageChange],
  );

  if (imagePreview) {
    return (
      <S.PreviewContainer>
        {imageLoading && <S.ImageSkeleton />}
        <S.PreviewImage
          src={imagePreview}
          alt="Preview"
          onLoad={() => setImageLoading(false)}
          style={{ display: imageLoading ? "none" : "block" }}
        />
        <S.RemoveButton onClick={handleRemove} aria-label="Remove image">
          ×
        </S.RemoveButton>
      </S.PreviewContainer>
    );
  }

  return (
    <>
      <S.UploadContainer
        $isDragOver={isDragOver}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        aria-label="Upload image"
      >
        <S.UploadIconWrapper>
          <S.UploadIcon viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 4L12 16M12 4L8 8M12 4L16 8M4 17V19C4 19.5304 4.21071 20.0391 4.58579 20.4142C4.96086 20.7893 5.46957 21 6 21H18C18.5304 21 19.0391 20.7893 19.4142 20.4142C19.7893 20.0391 20 19.5304 20 19V17"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </S.UploadIcon>
        </S.UploadIconWrapper>

        <S.UploadTextWrapper>
          <S.UploadTitle>사진을 업로드 해주세요</S.UploadTitle>
          <S.UploadSubtitle>SVG, PNG, JPG (최대 10MB)</S.UploadSubtitle>
        </S.UploadTextWrapper>

        <S.SelectButton type="button">Select from gallery</S.SelectButton>

        <S.HiddenFileInput
          ref={fileInputRef}
          type="file"
          accept="image/svg+xml,image/png,image/jpeg"
          onChange={handleFileInputChange}
        />
      </S.UploadContainer>

      {error && <S.ErrorMessage>{error}</S.ErrorMessage>}
    </>
  );
}
