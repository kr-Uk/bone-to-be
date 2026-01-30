package com.bonetobe.backend.post.domain;

import com.bonetobe.backend.post.domain.query.MyPostSummaryRaw;
import com.bonetobe.backend.post.domain.query.PostDetailSummaryRaw;
import com.bonetobe.backend.post.domain.query.PostListQuery;
import com.bonetobe.backend.post.domain.query.PostSummaryRaw;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface PostReader {

    Page<PostSummaryRaw> findPostList(PostListQuery query, Pageable pageable);

    PostDetailSummaryRaw findPostDetail(Long postId, Long viewerId);

    Post getById(Long postId);

    long countByUserId(Long userId);

    List<MyPostSummaryRaw> findMyPostList(Long userId);

    List<PostSummaryRaw> findLikedPostList(Long userId);

    List<PostSummaryRaw> findScrappedPostList(Long userId);
}
