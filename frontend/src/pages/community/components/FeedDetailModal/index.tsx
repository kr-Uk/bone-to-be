import { useEffect } from "react";
import { GrNext, GrPrevious } from "react-icons/gr";
import { MdClose } from "react-icons/md";

import { useFeedComments, useFeedDetail, useFeedLikes } from "../../api";

import { FeedDetailLeft } from "./components/FeedDetailLeft";
import { FeedDetailRight } from "./components/FeedDetailRight";
import * as S from "./FeedDetailModal.styles";

import type { FeedDetailModalProps } from "./types";

import { useProtectedNavigate } from "@/shared/hooks/useProtectedNavigate";

export function FeedDetailModal({
  onClose,
  feedId,
  onPrev,
  onNext,
  hasPrev = false,
  hasNext = false,
}: FeedDetailModalProps) {
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
  const protectedNavigate = useProtectedNavigate();

  useEffect(() => {
    // 모달 열릴 때 뒤 페이지 스크롤 막기
    document.body.style.overflow = "hidden";

    return () => {
      // 모달 닫히면 원래대로 복구
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleMobileAuthorClick = detail?.author.userId
    ? () => protectedNavigate(`/profile/${detail.author.userId}`)
    : undefined;

  return (
    <S.Overlay onClick={onClose}>
      <S.NavButton
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
      </S.NavButton>
      <S.NavButton
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
      </S.NavButton>
      <S.CloseButton
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onClose();
        }}
        aria-label="모달 닫기"
      >
        <MdClose aria-hidden="true" size={28} />
      </S.CloseButton>
      <S.ModalWrapper onClick={(e) => e.stopPropagation()}>
        <S.MobileHeader>
          {detail?.author.avatarUrl ? (
            <S.MobileAvatar
              src={detail.author.avatarUrl}
              alt="profile"
              onClick={handleMobileAuthorClick}
            />
          ) : (
            <S.MobileAvatarFallback onClick={handleMobileAuthorClick} />
          )}
          <div>
            <S.MobileNameRow>
              <S.MobileName onClick={handleMobileAuthorClick}>
                {detail?.author.username ?? "Loading..."}
              </S.MobileName>
              {detail?.author.bodyType ? (
                <S.BodyTypeBadge>{detail.author.bodyType}</S.BodyTypeBadge>
              ) : null}
            </S.MobileNameRow>
            <S.MobileMeta>{mobileMeta}</S.MobileMeta>
          </div>
        </S.MobileHeader>
        <FeedDetailLeft
          imageUrl={detail?.imageUrl}
          isLoading={isDetailLoading}
          hasError={Boolean(detailError)}
        />
        <FeedDetailRight
          detail={detail ?? null}
          likeUsers={likesData ?? []}
          likeCount={detail?.likeCount ?? 0}
          comments={commentsData?.items ?? []}
          isLoading={isDetailLoading || isCommentsLoading || isLikesLoading}
          hasError={Boolean(detailError || commentsError || likesError)}
        />
      </S.ModalWrapper>
    </S.Overlay>
  );
}
