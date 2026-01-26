package com.bonetobe.backend.post.infrastructure;

import com.bonetobe.backend.post.domain.PostReader;
import com.bonetobe.backend.post.domain.query.PostListQuery;
import com.bonetobe.backend.post.domain.query.PostSummaryRaw;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class PostReaderImpl implements PostReader {
    private final PostQueryDslRepository postQueryDslRepository;

    @Override
    public Page<PostSummaryRaw> findPostList(PostListQuery query, Pageable pageable) {
        return postQueryDslRepository.findPostList(query, pageable);
    }
}
