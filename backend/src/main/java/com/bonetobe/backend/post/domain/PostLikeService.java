package com.bonetobe.backend.post.domain;

import com.bonetobe.backend.post.domain.query.PostLikeUserSummaryRaw;

import java.util.List;

public interface PostLikeService {
    void like(Long postId, Long userId);

    void unlike(Long postId, Long userId);

    List<PostLikeUserSummaryRaw> getPostLikeUsers(Long postId, Long viewerId);
}
