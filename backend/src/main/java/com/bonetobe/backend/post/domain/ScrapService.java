package com.bonetobe.backend.post.domain;

public interface ScrapService {
    void scrap(Long postId, Long userId);
    void unscrap(Long postId, Long userId);
}
