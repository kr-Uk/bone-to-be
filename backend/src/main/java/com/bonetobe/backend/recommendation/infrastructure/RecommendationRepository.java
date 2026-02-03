package com.bonetobe.backend.recommendation.infrastructure;

import com.bonetobe.backend.recommendation.domain.Recommendation;
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

    @Query("""
        select r
        from Recommendation r
            join fetch r.bestPicture
            join fetch r.worstPicture
        where r.report.id = :reportId
    """)
    Optional<Recommendation> findByReportIdAndFileJoined(@Param("reportId") Long reportId);
}
