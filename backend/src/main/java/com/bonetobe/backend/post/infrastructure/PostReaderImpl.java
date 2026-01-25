package com.bonetobe.backend.post.infrastructure;

import com.bonetobe.backend.post.domain.PostReader;
import com.bonetobe.backend.post.domain.query.PostDetailSummary;
import com.bonetobe.backend.post.domain.query.PostDetailSummaryRaw;
import com.bonetobe.backend.post.domain.query.PostListQuery;
import com.bonetobe.backend.post.domain.query.PostSummary;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class PostReaderImpl implements PostReader {
    private final PostQueryDslRepository postQueryDslRepository;
    private final PostDetailQueryDslRepository postDetailQueryDslRepository;

    @Override
    public Page<PostSummary> findPostList(PostListQuery query, Pageable pageable) {
        return postQueryDslRepository.findPostList(query, pageable);
    }

    @Override
    public PostDetailSummaryRaw findPostDetail(Long postId) {
        return postDetailQueryDslRepository.findPostDetail(postId);
    }
}
