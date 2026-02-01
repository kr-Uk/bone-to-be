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
    private final ReplyReader replyReader;

    @Override
    public void like(Long replyId, Long userId) {

        // 댓글 없는 경우
        replyReader.getById(replyId);

        // 이미 좋아요 누른 경우
        int inserted = replyLikeStore.insertLike(replyId, userId);
        if (inserted == 0) {
            throw new BusinessException(ErrorCode.REPLY_ALREADY_LIKED);
        }

        // 카운트 증가
        replyLikeStore.updateReplyLikeCount(replyId, +1);
    }


    @Override
    public void unlike(Long replyId, Long userId) {

        // 댓글 없는 경우
        Reply reply = replyReader.getById(replyId); // 없으면 REPLY_NOT_FOUND

        // 좋아요 누른 적이 없는 경우
        int deleted = replyLikeStore.deleteLike(replyId, userId);
        if (deleted == 0) {
            throw new BusinessException(ErrorCode.REPLY_LIKE_NOT_FOUND);
        }

        // 음수 방지
        if (reply.getLikeCount() <= 0) {
            throw new BusinessException(ErrorCode.REPLY_LIST_INVALID_LIKE);
        }

        // 카운트 감소
        replyLikeStore.updateReplyLikeCount(replyId, -1);
    }

}
