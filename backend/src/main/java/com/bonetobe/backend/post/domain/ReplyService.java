package com.bonetobe.backend.post.domain;

import com.bonetobe.backend.post.domain.command.ReplyDeleteCommand;
import com.bonetobe.backend.post.domain.query.ReplySummaryRaw;
import com.bonetobe.backend.user.domain.User;

import java.util.List;

public interface ReplyService {
    List<ReplySummaryRaw> getReplyList(Long viewerId, Long userId);

    void createReply(Post post, User user, String content);

    void deleteReply(ReplyDeleteCommand command);
}
