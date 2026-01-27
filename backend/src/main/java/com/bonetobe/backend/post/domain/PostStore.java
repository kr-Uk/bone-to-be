package com.bonetobe.backend.post.domain;

public interface PostStore {
    Post save(Post post);

    void delete(Post post);
}
