package com.bonetobe.backend.recommendation.domain;

import com.bonetobe.backend.common.exception.BusinessException;
import com.bonetobe.backend.common.response.ErrorCode;
import com.bonetobe.backend.recommendation.infrastructure.RecommendationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Objects;

@Slf4j
@Component
@RequiredArgsConstructor
public class TryOnServiceImpl implements TryOnService {
    private final RecommendationRepository recommendationRepository;

    @Override
    @Transactional
    public Recommendation saveResult(Long reportId) {
        Recommendation recommendation = recommendationRepository.findByReportId(reportId).orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND_RECOMMENDATION));
        recommendation.complete();
        return recommendation;
    }

    @Override
    @Transactional
    public Recommendation save(Recommendation recommendation) {
        return recommendationRepository.save(recommendation);
    }

    @Override
    public Recommendation get(Long reportId, Long userId) {
        Recommendation recommendation = recommendationRepository.findByReportIdAndFileJoined(reportId).orElseThrow(() -> new BusinessException(ErrorCode.NOT_FOUND_RECOMMENDATION));
        if (!Objects.equals(recommendation.getUser().getId(), userId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }
        return recommendation;
    }
}
