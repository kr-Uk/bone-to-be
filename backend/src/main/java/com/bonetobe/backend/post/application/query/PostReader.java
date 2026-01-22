package com.bonetobe.backend.post.application.query;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface PostReader {
    Page<PostSummary> findPostList(PostListSearchCondition condition, Pageable pageable);
}
