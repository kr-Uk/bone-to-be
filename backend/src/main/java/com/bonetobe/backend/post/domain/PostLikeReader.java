package com.bonetobe.backend.post.domain;

import com.bonetobe.backend.post.domain.query.PostLikeUserSummaryRaw;

import java.util.List;

public interface PostLikeReader {
    List<PostLikeUserSummaryRaw> findPostLikeUsers(Long postId, Long viewerId);
}
