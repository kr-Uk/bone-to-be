package com.bonetobe.backend.post.infrastructure;

import com.bonetobe.backend.post.domain.PostLikeStore;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class PostLikeStoreImpl implements PostLikeStore {

    private final PostLikeJpaRepository postLikeJpaRepository;
    private final PostJpaRepository postJpaRepository;

    @Override
    public int insertLike(Long postId, Long userId) {
        return postLikeJpaRepository.insertLike(postId, userId);
    }

    @Override
    public int deleteLike(Long postId, Long userId) {
        return postLikeJpaRepository.deleteLike(postId, userId);
    }

    @Override
    public int updatePostLikeCount(Long postId, int delta) {
        return postJpaRepository.updateLikeCount(postId, delta);
    }
}
