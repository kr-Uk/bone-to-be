package com.bonetobe.backend.post.domain;

import com.bonetobe.backend.file.domain.FileService;
import com.bonetobe.backend.post.domain.query.PostListQuery;
import com.bonetobe.backend.post.domain.query.PostSummaryRaw;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PostServiceImpl implements PostService {

    private final PostReader postReader;

    @Override
    public Page<PostSummaryRaw> getPostList(PostListQuery query, Pageable pageable) {
        return postReader.findPostList(query, pageable);

    }
}
