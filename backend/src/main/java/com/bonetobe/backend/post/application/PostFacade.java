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
import com.bonetobe.backend.user.domain.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Transactional
@Component
@RequiredArgsConstructor
public class PostFacade {

    private final PostService postService;
    private final FileService fileService;
    private final UserService userService;
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
    public PostDetailSummary getPostDetail(Long postId) {

        PostDetailSummaryRaw raw = postService.getPostDetail(postId);

        String imageUrl = fileService.getPublicDownloadUrls(
                List.of(new FileDownloadUrl.Query(raw.fileId()))
        ).get(0).presignedUrl();

        return raw.toSummary(imageUrl);
    }

    public void createPost(PostCreateCommand command) {
        User user = userService.getUserById(command.userId());
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
                command.fileDomainCategory(),
                command.fileSize()
        );

        FileUploadUrl.Response res = fileService.createUploadUrl(req, command.userId());

        return new PostFileSummary(
                res.fileId(),
                res.uploadUrl()
        );
    }
}

