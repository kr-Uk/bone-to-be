import { useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const UploadArea = styled.div<{ $isDragging: boolean; $hasImage: boolean }>`
  position: relative;
  width: 100%;
  max-width: 400px;
  /* aspect-ratio: 9 / 16; */
  aspect-ratio: 3 / 4;
  background-color: ${({ theme, $hasImage }) =>
    $hasImage ? theme.colors.gray[900] : theme.colors.gray[100]};
  border: 2px dashed
    ${({ theme, $isDragging }) => ($isDragging ? theme.colors.primary : theme.colors.border)};
  border-radius: 1rem;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background-color: ${({ theme, $hasImage }) =>
      $hasImage ? theme.colors.gray[900] : theme.colors.gray[50]};
  }
`;

const UploadContent = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
`;

const UploadIcon = styled.div`
  font-size: 3rem;
  color: ${({ theme }) => theme.colors.gray[400]};
`;

const UploadTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.body.lg.semibold.fontSize};
  font-weight: ${({ theme }) => theme.typography.body.lg.semibold.fontWeight};
  color: ${({ theme }) => theme.colors.text};
`;

const UploadText = styled.p`
  font-size: ${({ theme }) => theme.typography.body.sm.regular.fontSize};
  color: ${({ theme }) => theme.colors.gray[500]};
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const HiddenInput = styled.input`
  display: none;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: ${({ theme }) => theme.spacing.md};
  right: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.backgroundDark};
  color: ${({ theme }) => theme.colors.secondary};
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray[800]};
  }
`;

interface ImageUploadProps {
  onImageSelect?: (imageData: string) => void;
}

const ImageUpload = ({ onImageSelect }: ImageUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 업로드 가능합니다.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreviewImage(result);
      onImageSelect?.(result);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleClick = () => {
    if (previewImage) return;
    document.getElementById("file-input")?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewImage(null);
    onImageSelect?.("");
  };

  return (
    <Container>
      <UploadArea
        $isDragging={isDragging}
        $hasImage={!!previewImage}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        {previewImage ? (
          <>
            <PreviewImage src={previewImage} alt="Preview" />
            <RemoveButton onClick={handleRemove}>✕</RemoveButton>
          </>
        ) : (
          <UploadContent>
            <UploadIcon>📷</UploadIcon>
            <UploadTitle>이미지 업로드</UploadTitle>
            <UploadText>
              클릭하거나 드래그하여
              <br />
              이미지를 업로드하세요
            </UploadText>
          </UploadContent>
        )}
      </UploadArea>

      <HiddenInput id="file-input" type="file" accept="image/*" onChange={handleFileChange} />
    </Container>
  );
};

export default ImageUpload;
