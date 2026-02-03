package com.bonetobe.backend.recommendation.domain;

public interface TryOnService {
    Recommendation saveResult(Long aLong);

    Recommendation save(Recommendation recommendation);

    Recommendation get(Long reportId, Long userId);
}
