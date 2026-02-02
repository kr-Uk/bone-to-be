package com.bonetobe.backend.post.domain;

import com.bonetobe.backend.common.exception.BusinessException;
import com.bonetobe.backend.common.response.ErrorCode;
import com.bonetobe.backend.post.domain.command.ReplyDeleteCommand;
import com.bonetobe.backend.post.domain.query.ReplySummaryRaw;
import com.bonetobe.backend.user.domain.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional
@Service
@RequiredArgsConstructor
public class ReplyServiceImpl implements ReplyService {

    private final ReplyReader replyReader;
    private final ReplyStore replyStore;
    private final PostReader postReader;

    @Override
    @Transactional(readOnly = true)
    public List<ReplySummaryRaw> getReplyList(Long postId, Long viewerId) {
        postReader.getById(postId);
        return replyReader.findReplyList(postId, viewerId);
    }

    @Override
    public void createReply(Post post, User user, String content) {
        postReader.getById(post.getId());

        Reply reply = Reply.create(post, user, content);
        replyStore.save(reply);

        int updated = replyStore.updatePostCommentCount(post.getId(), +1);
        if (updated != 1) {
            // 게시물 없음 등
            throw new BusinessException(ErrorCode.POST_NOT_FOUND);
        }
    }

    @Override
    public void deleteReply(ReplyDeleteCommand command) {
        Reply reply = replyReader.getById(command.replyId());

        if (!reply.getUser().getId().equals(command.userId())) {
            throw new BusinessException(ErrorCode.REPLY_DELETE_FORBIDDEN);
        }

        replyStore.delete(reply);

        int updated = replyStore.updatePostCommentCount(command.postId(), -1);
        if (updated != 1) {
            throw new BusinessException(ErrorCode.POST_NOT_FOUND);
        }
    }
}
