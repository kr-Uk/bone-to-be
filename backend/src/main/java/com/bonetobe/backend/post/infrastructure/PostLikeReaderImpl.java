package com.bonetobe.backend.post.infrastructure;

import com.bonetobe.backend.post.domain.PostLikeReader;
import com.bonetobe.backend.post.domain.query.PostLikeUserSummaryRaw;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class PostLikeReaderImpl implements PostLikeReader {
    private final PostLikeQueryDslRepository postLikeQueryDslRepository;
    @Override
    public List<PostLikeUserSummaryRaw> findPostLikeUsers(Long postId, Long viewerId) {
        return postLikeQueryDslRepository.findPostLikeUsers(postId, viewerId);
    }
}
