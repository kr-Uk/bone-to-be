package com.bonetobe.backend.recommendation.domain;

import com.bonetobe.backend.common.exception.BusinessException;
import com.bonetobe.backend.common.response.ErrorCode;
import com.bonetobe.backend.file.domain.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

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
    public Recommendation save(Recommendation recommendation) {
        return recommendationRepository.save(recommendation);
    }
}
