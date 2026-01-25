package com.bonetobe.backend.post.application;

import com.bonetobe.backend.file.domain.FileService;
import com.bonetobe.backend.file.presentation.FileDownloadUrl;
import com.bonetobe.backend.post.domain.PostService;
import com.bonetobe.backend.post.domain.query.PostDetailSummary;
import com.bonetobe.backend.post.domain.query.PostDetailSummaryRaw;
import com.bonetobe.backend.post.domain.query.PostListQuery;
import com.bonetobe.backend.post.domain.query.PostSummary;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
@RequiredArgsConstructor
public class PostFacade {

    private final PostService postService;
    private final FileService fileService;

    @Transactional(readOnly = true)
    public Page<PostSummary> getPostList(PostListQuery query, Pageable pageable) {
        return postService.getPostList(query, pageable);
    }

    @Transactional(readOnly = true)
    public PostDetailSummary getPostDetail(Long postId) {

        PostDetailSummaryRaw raw = postService.getPostDetail(postId);

        String imageUrl = fileService.getPublicDownloadUrls(
                List.of(new FileDownloadUrl.Query(raw.fileId()))
        ).get(0).presignedUrl();

        return raw.toSummary(imageUrl);
    }
}

