package com.bonetobe.backend.post.domain;

public interface PostLikeStore {
    int insertLike(Long postId, Long userId);
    int deleteLike(Long postId, Long userId);
    int updatePostLikeCount(Long postId, int delta);
}

