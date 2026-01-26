import styled from "styled-components";

import type { CaptureMode } from "@/shared/types/diagnosis";

type ModeSelectorProps = {
  mode: CaptureMode;
  onModeChange: (mode: CaptureMode) => void;
};

const Container = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  width: 100%;
  max-width: 28rem;
  margin: 0 auto ${({ theme }) => theme.spacing.lg};

  @media (min-width: 768px) {
    max-width: none;
  }

  @media (min-width: 1024px) {
    max-width: 448px;
    margin: 0 0 ${({ theme }) => theme.spacing.lg};
  }
`;

const TabButton = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.typography.body.md.semibold.fontSize};
  font-weight: ${({ theme }) => theme.typography.body.md.semibold.fontWeight};
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  background-color: transparent;
  color: ${({ theme, $active }) =>
    $active ? theme.colors.purple[600] : theme.colors.gray[400]};

  &:hover {
    color: ${({ theme, $active }) =>
      $active ? theme.colors.purple[600] : theme.colors.gray[300]};
  }

  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.purple[600]};
    outline-offset: 2px;
  }

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background-color: ${({ theme, $active }) =>
      $active ? theme.colors.purple[600] : "transparent"};
    transition: background-color 0.3s ease;
  }
`;

export function ModeSelector({ mode, onModeChange }: ModeSelectorProps) {
  return (
    <Container>
      <TabButton $active={mode === "camera"} onClick={() => onModeChange("camera")}>
        사진 촬영
      </TabButton>
      <TabButton $active={mode === "upload"} onClick={() => onModeChange("upload")}>
        사진 업로드
      </TabButton>
    </Container>
  );
}
