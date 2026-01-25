package com.bonetobe.backend.post.domain;

import com.bonetobe.backend.post.domain.query.PostDetailSummary;
import com.bonetobe.backend.post.domain.query.PostListQuery;
import com.bonetobe.backend.post.domain.query.PostSummary;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface PostReader {
    Page<PostSummary> findPostList(PostListQuery query, Pageable pageable);

    PostDetailSummary findPostDetail(Long postId);
}
