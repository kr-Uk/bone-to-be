package com.bonetobe.backend.post.application;

import com.bonetobe.backend.common.exception.BusinessException;
import com.bonetobe.backend.common.response.ErrorCode;
import com.bonetobe.backend.file.domain.FileService;
import com.bonetobe.backend.file.domain.StoredFile;
import com.bonetobe.backend.post.domain.PostService;
import com.bonetobe.backend.post.domain.command.PostCreateCommand;
import com.bonetobe.backend.post.domain.query.PostListQuery;
import com.bonetobe.backend.post.domain.query.PostSummary;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class PostFacade {

    private final PostService postService;
    private final FileService fileService;

    @Transactional(readOnly = true)
    public Page<PostSummary> getPostList(PostListQuery query, Pageable pageable) {
        return postService.getPostList(query, pageable);
    }

    @Transactional
    public void createPost(PostCreateCommand command) {
        postService.createPost(command);
    }

}

