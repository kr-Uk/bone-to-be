package com.bonetobe.backend.post.domain;

public interface ReplyLikeStore {

    int insertLike(Long replyId, Long userId);
    int deleteLike(Long replyId, Long userId);
    int updatePostLikeCount(Long replyId, int delta);
}
