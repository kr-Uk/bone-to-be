package com.bonetobe.backend.post.infrastructure;

import com.bonetobe.backend.post.domain.query.PostDetailSummary;

public interface PostDetailQueryDslRepository {
    PostDetailSummary findPostDetail(Long postId);
}
