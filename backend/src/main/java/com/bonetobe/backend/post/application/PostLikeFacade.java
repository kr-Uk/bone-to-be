package com.bonetobe.backend.post.application;

import com.bonetobe.backend.file.domain.FileService;
import com.bonetobe.backend.file.presentation.FileDownloadUrl;
import com.bonetobe.backend.post.domain.PostLikeService;
import com.bonetobe.backend.post.domain.query.PostLikeUserSummary;
import com.bonetobe.backend.post.domain.query.PostLikeUserSummaryRaw;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Transactional
@Component
@RequiredArgsConstructor
public class PostLikeFacade {

    private final PostLikeService postLikeService;
    private final FileService fileService;

    public void like(Long postId, Long userId) {
        postLikeService.like(postId, userId);
    }

    public void unlike(Long postId, Long userId) {
        postLikeService.unlike(postId, userId);
    }

    @Transactional(readOnly = true)
    public List<PostLikeUserSummary> getPostLikeUsers(Long postId, Long viewerId) {
        List<PostLikeUserSummaryRaw> raws = postLikeService.getPostLikeUsers(postId, viewerId);


        // 1) fileId 갖고오기
        List<Long> fileIds = raws.stream()
                .map(PostLikeUserSummaryRaw::fileId)
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
        return raws.stream()
                .map(r -> r.toSummary(urlMap.get(r.fileId())))
                .toList();
    }
}
