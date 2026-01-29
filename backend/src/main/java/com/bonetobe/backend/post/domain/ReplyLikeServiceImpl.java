package com.bonetobe.backend.post.domain;

import com.bonetobe.backend.common.exception.BusinessException;
import com.bonetobe.backend.common.response.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Transactional
@Service
@RequiredArgsConstructor
public class ReplyLikeServiceImpl implements ReplyLikeService {

    private final ReplyLikeStore replyLikeStore;

    @Override
    public void like(Long replyId, Long userId) {
        int inserted = replyLikeStore.insertLike(replyId, userId);
        if (inserted == 0) {
            // 이미 좋아요 한 경우 등
            throw new BusinessException(ErrorCode.BAD_REQUEST);
        }

        int updated = replyLikeStore.updatePostLikeCount(replyId, +1);
        if (updated != 1) {
            // 게시물 없는 경우 등
            throw new BusinessException(ErrorCode.POST_NOT_FOUND);
        }
    }

    @Override
    public void unlike(Long replyId, Long userId) {
        int deleted = replyLikeStore.deleteLike(replyId, userId);
        if (deleted == 0) {
            // 좋아요 안 했는데 취소
            throw new BusinessException(ErrorCode.BAD_REQUEST);
        }

        int updated = replyLikeStore.updatePostLikeCount(replyId, -1);
        if (updated != 1) {
            throw new BusinessException(ErrorCode.POST_LIST_INVALID_LIKE);
        }
    }
}
