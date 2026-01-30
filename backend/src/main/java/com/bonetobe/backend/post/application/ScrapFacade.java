package com.bonetobe.backend.post.application;

import com.bonetobe.backend.post.domain.ScrapService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Transactional
@Component
@RequiredArgsConstructor
public class ScrapFacade {

    private final ScrapService scrapService;

    public void scrap(Long postId, Long userId) {
        scrapService.scrap(postId, userId);
    }

    public void unscrap(Long postId, Long userId) {
        scrapService.unscrap(postId, userId);
    }
}
