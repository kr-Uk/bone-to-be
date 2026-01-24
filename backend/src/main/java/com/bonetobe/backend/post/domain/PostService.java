package com.bonetobe.backend.post.domain;

import com.bonetobe.backend.post.domain.query.PostListQuery;
import com.bonetobe.backend.post.domain.query.PostSummary;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface PostService {

    Page<PostSummary> getPostList(PostListQuery query, Pageable pageable);
}
