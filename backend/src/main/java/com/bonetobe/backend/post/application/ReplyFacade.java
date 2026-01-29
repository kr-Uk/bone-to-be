package com.bonetobe.backend.post.application;

import com.bonetobe.backend.file.domain.FileService;
import com.bonetobe.backend.file.presentation.FileDownloadUrl;
import com.bonetobe.backend.post.domain.Post;
import com.bonetobe.backend.post.domain.ReplyService;
import com.bonetobe.backend.post.domain.command.ReplyCreateCommand;
import com.bonetobe.backend.post.domain.command.ReplyDeleteCommand;
import com.bonetobe.backend.post.domain.query.PostLikeUserSummaryRaw;
import com.bonetobe.backend.post.domain.query.ReplySummary;
import com.bonetobe.backend.post.domain.query.ReplySummaryRaw;
import com.bonetobe.backend.user.domain.User;
import com.bonetobe.backend.user.domain.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Transactional
@Component
@RequiredArgsConstructor
public class ReplyFacade {
    private final ReplyService replyService;
    private final FileService fileService;
    private final UserService userService;

    @Transactional(readOnly = true)
    public List<ReplySummary> getReplyList(Long postId, Long viewerId) {
        List<ReplySummaryRaw> raws = replyService.getReplyList(postId, viewerId);

        // 1) fileId 갖고오기
        List<Long> fileIds = raws.stream()
                .map(r -> r.author().profileId())
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
                .map(r -> r.toSummary(urlMap.get(r.author().profileId())))
                .toList();
    }

    public void createReply(ReplyCreateCommand command){
        Post post = Post.of(command.postId());
        User user = userService.getUserById(command.userId());

        replyService.createReply(post, user, command.content());
    }

    public void deleteReply(ReplyDeleteCommand command){ replyService.deleteReply(command);}
}
