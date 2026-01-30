package com.bonetobe.backend.post.domain;

public interface ReplyStore {
    Reply save(Reply reply);
    void delete(Reply reply);

    int updatePostCommentCount(Long postId, int delta);
}
