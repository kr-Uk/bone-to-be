package com.bonetobe.backend.post.infrastructure;

import com.bonetobe.backend.post.domain.Post;
import com.bonetobe.backend.post.domain.PostStore;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class PostStoreImpl implements PostStore {

    private final PostJpaRepository postJpaRepository;

    @Override
    public Post save(Post post) {
        return postJpaRepository.save(post);
    }

    @Override
    public void delete(Post post) {
        postJpaRepository.delete(post);
    }
}
