package com.bonetobe.backend.post.domain;

import com.bonetobe.backend.file.domain.FileService;
import com.bonetobe.backend.file.presentation.FileDownloadUrl;
import com.bonetobe.backend.post.domain.query.PostDetailSummary;
import com.bonetobe.backend.post.domain.query.PostDetailSummaryRaw;
import com.bonetobe.backend.post.domain.query.PostListQuery;
import com.bonetobe.backend.post.domain.query.PostSummary;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PostServiceImpl implements PostService{

    private final PostReader postReader;

    @Override
    public Page<PostSummary> getPostList(PostListQuery query, Pageable pageable) {
        return postReader.findPostList(query, pageable);
    }

    @Override
    public PostDetailSummaryRaw getPostDetail(Long postId) {
        return postReader.findPostDetail(postId);
    }
}
