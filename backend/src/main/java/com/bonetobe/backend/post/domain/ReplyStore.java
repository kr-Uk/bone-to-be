package com.bonetobe.backend.post.domain;

public interface ReplyStore {
    Reply save(Reply reply);

    void delete(Reply reply);
}
