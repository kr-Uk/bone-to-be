package com.bonetobe.backend.post.domain;

import com.bonetobe.backend.post.domain.command.PostCreateCommand;
import com.bonetobe.backend.post.domain.query.PostListQuery;
import com.bonetobe.backend.post.domain.query.PostSummary;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PostServiceImpl implements PostService{

    private final PostReader postReader;
    private final PostStore postStore;
    @Override
    public Page<PostSummary> getPostList(PostListQuery query, Pageable pageable) {
        return postReader.findPostList(query, pageable);
    }

    public void createPost(PostCreateCommand command) {
        postStore.save(command);
    }


}
