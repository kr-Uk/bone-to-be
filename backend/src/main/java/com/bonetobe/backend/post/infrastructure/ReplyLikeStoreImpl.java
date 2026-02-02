package com.bonetobe.backend.post.infrastructure;

import com.bonetobe.backend.post.domain.ReplyLikeStore;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ReplyLikeStoreImpl implements ReplyLikeStore {
    private final ReplyLikeJpaRepository replyLikeJpaRepository;
    private final ReplyJpaRepository replyJpaRepository;

    @Override
    public int insertLike(Long replyId, Long userId) {
        return replyLikeJpaRepository.insertLike(replyId, userId);
    }

    @Override
    public int deleteLike(Long replyId, Long userId) {

        return replyLikeJpaRepository.deleteLike(replyId, userId);
    }

    @Override
    public int updateReplyLikeCount(Long replyId, int delta) {
        return replyJpaRepository.updateLikeCount(replyId, delta);
    }
}
