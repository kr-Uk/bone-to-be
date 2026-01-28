import styled from "styled-components";
import { FeedDetailLeft } from "./FeedDetailLeft";
import { FeedDetailRight } from "./FeedDetailRight";
import { useEffect } from "react";
import { useFeedComments, useFeedDetail, useFeedLikes } from "../api";
import { MdClose } from "react-icons/md";
import { GrNext, GrPrevious } from "react-icons/gr";

interface Props {
  onClose: () => void;
  feedId: string;
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
}

export function FeedDetailModal({
  onClose,
  feedId,
  onPrev,
  onNext,
  hasPrev = false,
  hasNext = false,
}: Props) {
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
  const {
    data: likesData,
    isLoading: isLikesLoading,
    error: likesError,
  } = useFeedLikes({ feedId, page: 1, limit: 50 });

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
      <NavButton
        type="button"
        $position="left"
        onClick={(event) => {
          event.stopPropagation();
          onPrev?.();
        }}
        disabled={!hasPrev}
        aria-label="이전 피드 보기"
      >
        <GrPrevious aria-hidden="true" size={18} />
      </NavButton>
      <NavButton
        type="button"
        $position="right"
        onClick={(event) => {
          event.stopPropagation();
          onNext?.();
        }}
        disabled={!hasNext}
        aria-label="다음 피드 보기"
      >
        <GrNext aria-hidden="true" size={18} />
      </NavButton>
      <CloseButton
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onClose();
        }}
        aria-label="모달 닫기"
      >
        <MdClose aria-hidden="true" size={28} />
      </CloseButton>
      <ModalWrapper onClick={(e) => e.stopPropagation()}>
        <FeedDetailLeft
          imageUrl={detail?.imageUrl}
          isLoading={isDetailLoading}
          hasError={Boolean(detailError)}
        />
        <FeedDetailRight
          detail={detail ?? null}
          likeUsers={likesData?.likes ?? []}
          likeCount={likesData?.likeCount}
          comments={commentsData?.items ?? []}
          isLoading={isDetailLoading || isCommentsLoading || isLikesLoading}
          hasError={Boolean(detailError || commentsError || likesError)}
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

const NavButton = styled.button<{ $position: "left" | "right" }>`
  position: fixed;
  top: 50%;
  ${({ $position, theme }) =>
    $position === "left" ? `left: ${theme.spacing.lg};` : `right: ${theme.spacing.lg};`}
  transform: translateY(-50%);
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  background: ${({ theme }) => theme.colors.gray[50]};
  color: ${({ theme }) => theme.colors.gray[900]};
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  ${({ theme }) => theme.typography.body.lg.semibold};
  transition: transform 160ms ease;

  &:hover:not(:disabled),
  &:active:not(:disabled) {
    transform: translateY(-50%) scale(1.15);
  }

  &:disabled {
    opacity: 0.35;
    cursor: default;
  }
`;

const CloseButton = styled.button`
  position: fixed;
  top: ${({ theme }) => theme.spacing.lg};
  right: ${({ theme }) => theme.spacing.lg};
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.7);
  color: ${({ theme }) => theme.colors.gray[50]};
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  ${({ theme }) => theme.typography.body.lg.semibold};
  transition: transform 160ms ease;

  &:hover,
  &:active {
    transform: scale(1.15);
  }
`;

