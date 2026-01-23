package com.bonetobe.backend.post.domain;

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
    @Override
    public Page<PostSummary> getPostList(PostListQuery condition, Pageable pageable) {
        return postReader.findPostList(condition, pageable);
    }
}
