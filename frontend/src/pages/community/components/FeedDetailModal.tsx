import { useEffect } from "react";
import { GrNext, GrPrevious } from "react-icons/gr";
import { MdClose } from "react-icons/md";
import styled from "styled-components";

import { useFeedComments, useFeedDetail, useFeedLikes } from "../api";

import { FeedDetailLeft } from "./FeedDetailLeft";
import { FeedDetailRight } from "./FeedDetailRight";

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
  const { data: detail, isLoading: isDetailLoading, error: detailError } = useFeedDetail(feedId);
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
  const mobileMeta = detail?.height
    ? `키 ${detail.height}cm${detail.weight ? ` · 몸무게 ${detail.weight}kg` : ""}`
    : detail?.weight
      ? `몸무게 ${detail.weight}kg`
      : "정보 없음";

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
        <MobileHeader>
          {detail?.author.avatarUrl ? (
            <MobileAvatar src={detail.author.avatarUrl} alt="profile" />
          ) : (
            <MobileAvatarFallback />
          )}
          <div>
            <MobileNameRow>
              <MobileName>{detail?.author.username ?? "Loading..."}</MobileName>
              {detail?.author.bodyType ? (
                <BodyTypeBadge>{detail.author.bodyType}</BodyTypeBadge>
              ) : null}
            </MobileNameRow>
            <MobileMeta>{mobileMeta}</MobileMeta>
          </div>
        </MobileHeader>
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

  z-index: 9999; /* 페이지보다 위 */
`;

const ModalWrapper = styled.div`
  width: min(95vw, 1200px);
  height: 85vh;
  background: black;
  border-radius: 16px;
  display: flex;
  min-width: 0;
  overflow: hidden;

  @media (max-width: 430px) {
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

  @media (hover: hover) {
    &:hover:not(:disabled) {
      transform: translateY(-50%) scale(1.15);
    }
  }

  @media (hover: none) {
    &:active:not(:disabled) {
      transform: translateY(-50%) scale(1.15);
    }
  }

  &:disabled {
    opacity: 0.35;
    cursor: default;
  }

  @media (max-width: 430px) {
    width: 32px;
    height: 32px;
  }

  @media (max-width: 430px) {
    svg {
      width: 14px;
      height: 14px;
    }
  }
`;

const MobileHeader = styled.div`
  display: none;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: #262626;
  border-bottom: 1px solid #3f3f3f;

  @media (max-width: 430px) {
    display: flex;
  }
`;

const MobileAvatar = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  background: #525252;
  flex-shrink: 0;
`;

const MobileAvatarFallback = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #525252;
  flex-shrink: 0;
`;

const MobileName = styled.div`
  color: #fafafa;
  font-weight: 600;
  font-size: 14px;
`;

const MobileNameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const BodyTypeBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px 7px;
  border-radius: 5px;
  border: 1px solid #9810fa;
  color: #9810fa;
  font-size: 10px;
  font-weight: 700;
  line-height: 15px;
  background: rgba(152, 16, 250, 0.12);
`;

const MobileMeta = styled.div`
  color: #a1a1a1;
  font-size: 12px;
`;

const CloseButton = styled.button`
  position: fixed;
  top: ${({ theme }) => theme.spacing.lg};
  right: ${({ theme }) => theme.spacing.lg};
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.gray[50]};
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  ${({ theme }) => theme.typography.body.lg.semibold};
  transition: transform 160ms ease;

  @media (hover: hover) {
    &:hover {
      transform: scale(1.15);
    }
  }

  @media (hover: none) {
    &:active {
      transform: scale(1.15);
    }
  }

  @media (max-width: 430px) {
    top: 8px;
    right: 8px;
    width: 32px;
    height: 32px;
  }
`;
