package com.bonetobe.backend.post.domain;

import com.bonetobe.backend.post.domain.query.PostDetailSummaryRaw;
import com.bonetobe.backend.post.domain.query.PostListQuery;
import com.bonetobe.backend.post.domain.query.PostSummaryRaw;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface PostReader {

    Page<PostSummaryRaw> findPostList(PostListQuery query, Pageable pageable);

    PostDetailSummaryRaw findPostDetail(Long postId, Long viewerId);

    Post getById(Long postId);

    long countByUserId(Long userId);
}
