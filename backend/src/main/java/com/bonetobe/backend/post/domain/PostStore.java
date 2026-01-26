package com.bonetobe.backend.post.domain;

import com.bonetobe.backend.post.domain.command.PostCreateCommand;
import com.bonetobe.backend.post.domain.command.PostUpdateCommand;

public interface PostStore {
    Post save(PostCreateCommand command);

    void delete(Post post);

    void update(Post post, PostUpdateCommand command);
}
