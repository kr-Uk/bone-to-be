package com.bonetobe.backend.post.infrastructure;

import com.bonetobe.backend.post.domain.query.ReplySummaryRaw;

import java.util.List;

public interface ReplyQueryDslRepository {
    List<ReplySummaryRaw> findReplyList(Long postId, Long viewerId);
}
