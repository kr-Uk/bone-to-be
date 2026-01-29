import { useRef, useState } from "react";
import { IoCamera } from "react-icons/io5";
import styled from "styled-components";

import type { ChangeEvent, DragEvent } from "react";

const Container = styled.div`
  width: 100%;
  max-width: 299px;
  margin: 0 auto;

  @media (min-width: 768px) and (max-width: 1023px) {
    max-width: 361px;
  }

  @media (min-width: 1024px) {
    max-width: 448px;
  }
`;

const UploadBox = styled.div<{ $isDragging: boolean; $hasImage: boolean }>`
  position: relative;
  width: 100%;
  aspect-ratio: 3 / 4;
  background-color: ${({ theme }) => theme.colors.gray[800]};
  border: 2px dashed
    ${({ theme, $isDragging }) => ($isDragging ? theme.colors.purple[600] : theme.colors.secondary)};
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;

  &:hover {
    border-color: ${({ theme }) => theme.colors.purple[600]};
    background-color: ${({ theme }) => theme.colors.gray[700]};
  }

  &:focus-within {
    outline: 2px solid ${({ theme }) => theme.colors.purple[600]};
    outline-offset: 2px;
  }
`;

const CornerBracket = styled.div<{
  $position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}>`
  position: absolute;
  width: 24px;
  height: 24px;
  border-color: ${({ theme }) => theme.colors.purple[600]};

  ${({ $position }) => {
    switch ($position) {
      case "top-left":
        return `
          top: 12px;
          left: 12px;
          border-top: 2px solid;
          border-left: 2px solid;
        `;
      case "top-right":
        return `
          top: 12px;
          right: 12px;
          border-top: 2px solid;
          border-right: 2px solid;
        `;
      case "bottom-left":
        return `
          bottom: 12px;
          left: 12px;
          border-bottom: 2px solid;
          border-left: 2px solid;
        `;
      case "bottom-right":
        return `
          bottom: 12px;
          right: 12px;
          border-bottom: 2px solid;
          border-right: 2px solid;
        `;
    }
  }}
`;

const TopGlowLine = styled.div`
  position: absolute;
  top: 40px;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  height: 2px;
  background: ${({ theme }) => theme.colors.purple[600]};
  box-shadow:
    0 0 12px ${({ theme }) => theme.colors.purple[600]},
    0 0 24px ${({ theme }) => theme.colors.purple[600]}40;
  border-radius: 1px;
`;

const IconBackground = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.purple[900]};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  @media (min-width: 768px) {
    width: 96px;
    height: 96px;
  }
`;

const CameraIcon = styled(IoCamera)`
  width: 40px;
  height: 40px;
  color: ${({ theme }) => theme.colors.secondary};

  @media (min-width: 768px) {
    width: 48px;
    height: 48px;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  z-index: 1;
`;

const MainText = styled.p`
  font-size: ${({ theme }) => theme.typography.body.md.medium.fontSize};
  font-weight: ${({ theme }) => theme.typography.body.md.medium.fontWeight};
  color: ${({ theme }) => theme.colors.secondary};
  text-align: center;

  @media (min-width: 768px) {
    font-size: ${({ theme }) => theme.typography.body.lg.medium.fontSize};
  }
`;

const FileInfo = styled.p`
  font-size: ${({ theme }) => theme.typography.body.sm.regular.fontSize};
  color: ${({ theme }) => theme.colors.gray[400]};
  text-align: center;
`;

const HiddenInput = styled.input`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
`;

const ErrorMessage = styled.p`
  margin-top: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.typography.body.sm.regular.fontSize};
  color: #ef4444;
  text-align: center;
`;

interface UploadAreaProps {
  onImageSelect: (imageData: string) => void;
  selectedImage?: string | null;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ["image/jpeg", "image/png"];

export const UploadArea = ({ onImageSelect, selectedImage }: UploadAreaProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    setError(null);

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("JPG 또는 PNG 파일만 업로드 가능합니다.");
      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("파일 크기는 10MB를 초과할 수 없습니다.");
      return false;
    }

    return true;
  };

  const handleFileRead = (file: File) => {
    if (!validateFile(file)) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === "string") {
        onImageSelect(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileRead(file);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileRead(file);
    }
  };

  return (
    <Container>
      <UploadBox
        $isDragging={isDragging}
        $hasImage={!!selectedImage}
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        aria-label="이미지 업로드 영역"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleClick();
          }
        }}
      >
        <CornerBracket $position="top-left" />
        <CornerBracket $position="top-right" />
        <CornerBracket $position="bottom-left" />
        <CornerBracket $position="bottom-right" />
        <TopGlowLine />

        {selectedImage ? (
          <PreviewImage src={selectedImage} alt="업로드된 이미지 미리보기" />
        ) : (
          <Content>
            <IconBackground>
              <CameraIcon aria-hidden="true" />
            </IconBackground>
            <MainText>스캔을 시작하려면 클릭하세요</MainText>
            <FileInfo>JPG, PNG / Max 10MB</FileInfo>
          </Content>
        )}

        <HiddenInput
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png"
          onChange={handleFileChange}
          aria-label="파일 선택"
        />
      </UploadBox>
      {error && <ErrorMessage role="alert">{error}</ErrorMessage>}
    </Container>
  );
};
