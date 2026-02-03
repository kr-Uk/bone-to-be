package com.bonetobe.backend.recommendation.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface RecommendationRepository extends JpaRepository<Recommendation, Long> {

    @Query("""
        select r
        from Recommendation r
        where r.report.id = :reportId
    """)
    Optional<Recommendation> findByReportId(@Param("reportId") Long reportId);
}
