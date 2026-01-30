package com.bonetobe.backend.post.infrastructure;

import com.bonetobe.backend.common.exception.BusinessException;
import com.bonetobe.backend.common.response.ErrorCode;
import com.bonetobe.backend.post.domain.Post;
import com.bonetobe.backend.post.domain.PostReader;
import com.bonetobe.backend.post.domain.query.MyPostSummaryRaw;
import com.bonetobe.backend.post.domain.query.PostDetailSummaryRaw;
import com.bonetobe.backend.post.domain.query.PostListQuery;
import com.bonetobe.backend.post.domain.query.PostSummaryRaw;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class PostReaderImpl implements PostReader {
    private final PostQueryDslRepository postQueryDslRepository;
    private final PostDetailQueryDslRepository postDetailQueryDslRepository;
    private final PostJpaRepository postJpaRepository;

    @Override
    public Page<PostSummaryRaw> findPostList(PostListQuery query, Pageable pageable) {
        return postQueryDslRepository.findPostList(query, pageable);
    }

    @Override
    public PostDetailSummaryRaw findPostDetail(Long postId, Long viewerId) {
        return postDetailQueryDslRepository.findPostDetail(postId, viewerId);
    }

    @Override
    public Post getById(Long postId) {
        return postJpaRepository.findById(postId)
                .orElseThrow(() -> new BusinessException(ErrorCode.POST_NOT_FOUND));
    }

    @Override
    public long countByUserId(Long userId) {
        return postJpaRepository.countByUserId(userId);
    }

    @Override
    public List<MyPostSummaryRaw> findMyPostList(Long userId) {
        return postQueryDslRepository.findMyPostList(userId);
    }

    @Override
    public List<PostSummaryRaw> findLikedPostList(Long userId) {
        return postQueryDslRepository.findLikedPostList(userId);
    }

    @Override
    public List<PostSummaryRaw> findScrappedPostList(Long userId) {
        return postQueryDslRepository.findScrappedPostList(userId);
    }
}
