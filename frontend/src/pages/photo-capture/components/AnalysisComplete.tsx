import { IoCheckmarkCircle } from "react-icons/io5";
import styled, { keyframes } from "styled-components";

type AnalysisCompleteProps = {
  isOpen: boolean;
  onNavigateToResults: () => void;
};

const scaleIn = keyframes`
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const Overlay = styled.div<{ $isOpen: boolean }>`
  display: ${({ $isOpen }) => ($isOpen ? "flex" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.85);
  z-index: 9999;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.lg};
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xl};
  max-width: 400px;
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xxl};
  background-color: ${({ theme }) => theme.colors.gray[900]};
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.colors.gray[700]};
`;

const IconWrapper = styled.div`
  font-size: 80px;
  color: #10b981;
  animation: ${scaleIn} 0.5s ease-out;
`;

const Title = styled.h2`
  font-size: ${({ theme }) => theme.typography.heading.lg.fontSize};
  font-weight: ${({ theme }) => theme.typography.heading.lg.fontWeight};
  color: ${({ theme }) => theme.colors.secondary};
  margin: 0;
`;

const Description = styled.p`
  font-size: ${({ theme }) => theme.typography.body.lg.regular.fontSize};
  font-weight: ${({ theme }) => theme.typography.body.lg.regular.fontWeight};
  color: ${({ theme }) => theme.colors.gray[300]};
  margin: 0;
  line-height: 1.6;
`;

const Button = styled.button`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border-radius: 9999px;
  font-size: ${({ theme }) => theme.typography.body.md.semibold.fontSize};
  font-weight: ${({ theme }) => theme.typography.body.md.semibold.fontWeight};
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: ${({ theme }) => theme.colors.purple[600]};
  color: ${({ theme }) => theme.colors.secondary};

  &:hover {
    background-color: ${({ theme }) => theme.colors.purple[900]};
  }

  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.purple[600]};
    outline-offset: 2px;
  }
`;

export function AnalysisComplete({ isOpen, onNavigateToResults }: AnalysisCompleteProps) {
  return (
    <Overlay $isOpen={isOpen}>
      <ModalContent>
        <IconWrapper>
          <IoCheckmarkCircle />
        </IconWrapper>
        <div>
          <Title>분석 완료!</Title>
          <Description style={{ marginTop: "16px" }}>
            체형 분석이 성공적으로 완료되었습니다.
            <br />
            결과를 확인해보세요.
          </Description>
        </div>
        <Button onClick={onNavigateToResults}>결과 확인하기</Button>
      </ModalContent>
    </Overlay>
  );
}
