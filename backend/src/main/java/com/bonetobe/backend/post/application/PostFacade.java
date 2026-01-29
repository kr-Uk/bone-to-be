package com.bonetobe.backend.post.application;

import com.bonetobe.backend.file.domain.FileService;
import com.bonetobe.backend.file.domain.StoredFile;
import com.bonetobe.backend.file.presentation.FileDownloadUrl;
import com.bonetobe.backend.file.presentation.FileUploadUrl;
import com.bonetobe.backend.post.domain.PostService;
import com.bonetobe.backend.post.domain.command.PostCreateCommand;
import com.bonetobe.backend.post.domain.command.PostDeleteCommand;
import com.bonetobe.backend.post.domain.command.PostFileCommand;
import com.bonetobe.backend.post.domain.command.PostUpdateCommand;
import com.bonetobe.backend.post.domain.query.*;
import com.bonetobe.backend.style.domain.Style;
import com.bonetobe.backend.style.domain.StyleService;
import com.bonetobe.backend.user.domain.User;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Transactional
@Component
@RequiredArgsConstructor
public class PostFacade {

    private final PostService postService;
    private final FileService fileService;
    private final StyleService styleService;

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
    public PostDetailSummary getPostDetail(Long postId, Long viewerId) {

        PostDetailSummaryRaw raw = postService.getPostDetail(postId, viewerId);

        // 게시글 사진과 프로필 사진 fileId들
        List<Long> fileIds = Arrays.asList(
                raw.fileId(),
                raw.author().profileId()
        );

        // presigned url 한번에 발급하기
        Map<Long, String> urlMap = fileService.getPublicDownloadUrls(
                fileIds.stream()
                        .filter(Objects::nonNull)
                        .distinct()
                        .map(FileDownloadUrl.Query::new)
                        .toList()
        ).stream().collect(Collectors.toMap(
                FileDownloadUrl.Result::fileId,
                FileDownloadUrl.Result::presignedUrl
        ));

        return raw.toSummary(
                urlMap.get(raw.fileId()),
                urlMap.get(raw.author().profileId())
        );
    }

    public void createPost(PostCreateCommand command) {
        User user = User.of(command.userId());
        StoredFile file = fileService.getFile(command.fileId());
        List<Style> styles = styleService.getStylesByNames(command.styles());

        postService.createPost(command, user, file, styles);

        fileService.completeUpload(file, command.userId());
    }

    public void deletePost(PostDeleteCommand command) {
        postService.deletePost(command);
    }

    @Transactional
    public void updatePost(Long postId, PostUpdateCommand command) {

        List<Style> styles = styleService.getStylesByNames(command.styles());

        postService.updatePost(postId, command, styles);
    }

    @Transactional
    public PostFileSummary issuePresignedUrl(PostFileCommand command) {
        FileUploadUrl.Request req = new FileUploadUrl.Request(
                command.originalFileName(),
                command.contentType(),
                command.fileSize()
        );

        FileUploadUrl.Response res = fileService.createUploadUrl(req, command.userId(), command.fileDomainCategory());

        return new PostFileSummary(
                res.fileId(),
                res.uploadUrl()
        );
    }
}

