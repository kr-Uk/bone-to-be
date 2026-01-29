package com.bonetobe.backend.post.domain;

import com.bonetobe.backend.post.domain.query.ReplySummaryRaw;

import java.util.List;

public interface ReplyReader {
    List<ReplySummaryRaw> findReplyList(Long postId, Long viewerId);

    Reply getById(Long replyId);
}
