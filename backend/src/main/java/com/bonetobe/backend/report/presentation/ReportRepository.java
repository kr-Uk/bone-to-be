package com.bonetobe.backend.report.presentation;

import com.bonetobe.backend.report.domain.Report;
import com.bonetobe.backend.user.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {
    List<Report> findByUserOrderByCreatedAtDesc(User user);

    @Query("""
        select r
        from Report r
            join fetch r.user u
        where r.status in ("PENDING", "COMPLETED")
            and r.id = :id
    """)
    Optional<Report> findByIdAndActive(@Param("userId") Long id);

    @Query("""
        select r
        from Report r
            join fetch r.user u
        where r.status in ("PENDING", "COMPLETED")
            and r.user.id = :userId
            and r.representative = true
    """)
    Optional<Report> findRepresentativeReport(@Param("userId") Long userId);
}
