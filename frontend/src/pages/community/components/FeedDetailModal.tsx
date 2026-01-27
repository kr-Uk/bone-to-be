import styled from "styled-components";
import { FeedDetailLeft } from "./FeedDetailLeft";
import { FeedDetailRight } from "./FeedDetailRight";
import { useEffect } from "react";

interface Props {
  onClose: () => void;
}

export function FeedDetailModal({ onClose }: Props) {
  useEffect(() => {
    // 모달 열릴 때 뒤 페이지 스크롤 막기
    document.body.style.overflow = "hidden";

    return () => {
      // 모달 닫히면 원래대로 복구
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <Overlay onClick={onClose}>
      <ModalWrapper onClick={(e) => e.stopPropagation()}>
        <FeedDetailLeft />
        <FeedDetailRight />
      </ModalWrapper>
    </Overlay>
  );
}
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);

  display: flex;
  justify-content: center;
  align-items: center;

  z-index: 9999;        /* 페이지보다 위 */
`;

const ModalWrapper = styled.div`
  width: 1200px;
  height: 85vh;
  background: black;
  border-radius: 16px;
  display: flex;
  overflow: hidden;

  @media (max-width: 768px) {
    flex-direction: column;
    width: 95%;
    height: 90vh;
  }
`;

