package com.bonetobe.backend.post.infrastructure;

import com.bonetobe.backend.post.domain.query.PostDetailSummaryRaw;

public interface PostDetailQueryDslRepository {
    PostDetailSummaryRaw findPostDetail(Long postId, Long viewerId);
}
