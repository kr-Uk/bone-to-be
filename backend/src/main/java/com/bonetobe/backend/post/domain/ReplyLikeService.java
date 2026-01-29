package com.bonetobe.backend.post.domain;

import com.bonetobe.backend.post.domain.query.PostLikeUserSummaryRaw;

import java.util.List;

public interface ReplyLikeService {
    void like(Long replyId, Long userId);

    void unlike(Long replyId, Long userId);
}
