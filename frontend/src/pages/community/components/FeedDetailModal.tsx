import styled from "styled-components";
import { FeedDetailLeft } from "./FeedDetailLeft";
import { FeedDetailRight } from "./FeedDetailRight";
import { useEffect } from "react";
import { useFeedComments, useFeedDetail } from "../api";

interface Props {
  onClose: () => void;
  feedId: string;
}

export function FeedDetailModal({ onClose, feedId }: Props) {
  const {
    data: detail,
    isLoading: isDetailLoading,
    error: detailError,
  } = useFeedDetail(feedId);
  const {
    data: commentsData,
    isLoading: isCommentsLoading,
    error: commentsError,
  } = useFeedComments({ feedId, page: 1, limit: 50 });

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
        <FeedDetailLeft
          imageUrl={detail?.imageUrl}
          isLoading={isDetailLoading}
          hasError={Boolean(detailError)}
        />
        <FeedDetailRight
          detail={detail ?? null}
          comments={commentsData?.items ?? []}
          isLoading={isDetailLoading || isCommentsLoading}
          hasError={Boolean(detailError || commentsError)}
        />
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
  width: min(95vw, 1200px);
  height: 85vh;
  background: black;
  border-radius: 16px;
  display: flex;
  min-width: 0;
  overflow: hidden;

  @media (max-width: 1024px) {
    flex-direction: column;
    width: 95%;
    height: 90vh;
  }
`;

