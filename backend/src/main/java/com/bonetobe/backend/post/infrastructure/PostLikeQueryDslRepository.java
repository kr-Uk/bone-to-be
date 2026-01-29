package com.bonetobe.backend.post.infrastructure;

import com.bonetobe.backend.post.domain.query.PostLikeUserSummaryRaw;

import java.util.List;

public interface PostLikeQueryDslRepository {
    List<PostLikeUserSummaryRaw> findPostLikeUsers(Long postId, Long viewerId);
}
