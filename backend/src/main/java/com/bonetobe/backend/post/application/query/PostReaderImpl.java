package com.bonetobe.backend.post.application.query;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class PostReaderImpl implements PostReader {

    private final PostQueryRepository postQueryRepository;

    @Override
    public Page<PostSummary> findPostList(PostListSearchCondition condition, Pageable pageable) {
        return postQueryRepository.findPostList(condition, pageable);
    }
}
