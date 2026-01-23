package com.bonetobe.backend.post.infrastructure;

import com.bonetobe.backend.post.domain.query.PostListQuery;
import com.bonetobe.backend.post.domain.query.PostSummary;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface PostQueryDslRepository {
    Page<PostSummary> findPostList(PostListQuery condition, Pageable pageable);
}
