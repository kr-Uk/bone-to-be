package com.bonetobe.backend.post.domain;

public interface ScrapStore {
    int insertScrap(Long postId, Long userId);
    int deleteScrap(Long postId, Long userId);
}
