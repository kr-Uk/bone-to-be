package com.bonetobe.backend.post.application;

import com.bonetobe.backend.file.domain.FileService;
import com.bonetobe.backend.file.presentation.FileDownloadUrl;
import com.bonetobe.backend.post.domain.PostService;
import com.bonetobe.backend.post.domain.query.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class PostFacade {

    private final PostService postService;
    private final FileService fileService;

    @Transactional(readOnly = true)
    public Page<PostSummary> getPostList(PostListQuery query, Pageable pageable) {
        Page<PostSummaryRaw> rawPage = postService.getPostList(query, pageable);

        // fileId 갖고오기
        List<Long> fileIds = rawPage.getContent().stream()
                .map(PostSummaryRaw::fileId)
                .distinct()
                .toList();

        // presigned url 발급
        // fileId -> presigned url로 매핑 과정
        Map<Long, String> urlMap = fileService.getPublicDownloadUrls(
                        fileIds.stream().map(FileDownloadUrl.Query::new).toList()
                ).stream()
                .collect(Collectors.toMap(
                        FileDownloadUrl.Result::fileId,
                        FileDownloadUrl.Result::presignedUrl
                ));

        // raw -> summary 변환
        return rawPage.map(r -> r.toSummary(urlMap.get(r.fileId())));
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

