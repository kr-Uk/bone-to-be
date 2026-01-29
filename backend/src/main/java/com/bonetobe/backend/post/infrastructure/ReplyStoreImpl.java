package com.bonetobe.backend.post.infrastructure;

import com.bonetobe.backend.post.domain.Reply;
import com.bonetobe.backend.post.domain.ReplyStore;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ReplyStoreImpl implements ReplyStore {

    private final ReplyJpaRepository replyJpaRepository;
    private final PostJpaRepository postJpaRepository;

    @Override
    public Reply save(Reply reply) {
        return replyJpaRepository.save(reply);
    }

    @Override
    public void delete(Reply reply) {
        replyJpaRepository.delete(reply);
    }

    @Override
    public int updatePostCommentCount(Long postId, int delta) {
        return postJpaRepository.updateCommentCount(postId, delta);
    }
}
