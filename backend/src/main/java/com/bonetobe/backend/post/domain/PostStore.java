package com.bonetobe.backend.post.domain;

import com.bonetobe.backend.post.domain.command.PostCreateCommand;

public interface PostStore {
    Post save(PostCreateCommand command);

    void delete(Post post);

}
