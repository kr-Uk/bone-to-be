package com.bonetobe.backend.post.infrastructure;

import com.bonetobe.backend.post.domain.query.UserPostSummaryRaw;
import com.bonetobe.backend.post.domain.query.PostListQuery;
import com.bonetobe.backend.post.domain.query.PostSummaryRaw;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface PostQueryDslRepository {
    Page<PostSummaryRaw> findPostList(PostListQuery query, Pageable pageable);

    List<UserPostSummaryRaw> findUserPostList(Long userId);

    List<PostSummaryRaw> findLikedPostList(Long viewerId);

    List<PostSummaryRaw> findScrappedPostList(Long viewerId);
}
