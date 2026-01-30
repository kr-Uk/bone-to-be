package com.bonetobe.backend.post.infrastructure;

import com.bonetobe.backend.post.domain.ScrapStore;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ScrapStoreImpl implements ScrapStore {

    private final ScrapJpaRepository scrapJpaRepository;

    @Override
    public int insertScrap(Long postId, Long userId) {
        return scrapJpaRepository.insertScrap(postId, userId);
    }

    @Override
    public int deleteScrap(Long postId, Long userId) {
        return scrapJpaRepository.deleteScrap(postId, userId);
    }
}
