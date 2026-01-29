package com.bonetobe.backend.post.application;

import com.bonetobe.backend.post.domain.ReplyLikeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Transactional
@Component
@RequiredArgsConstructor
public class ReplyLikeFacade {

    private final ReplyLikeService replyLikeService;

    public void like(Long replyId, Long userId) {
        replyLikeService.like(replyId, userId);
    }

    public void unlike(Long replyId, Long userId) {
        replyLikeService.unlike(replyId, userId);
    }

}
