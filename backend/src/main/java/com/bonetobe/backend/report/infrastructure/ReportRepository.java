package com.bonetobe.backend.report.infrastructure;

import com.bonetobe.backend.report.domain.Report;
import com.bonetobe.backend.user.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
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
                and r.id = :userId
    """)
    Optional<Report> findByIdAndActive(@Param("userId") Long userId);

    @Query("""
        select r
        from Report r
            join fetch r.user u
        where r.status in ("PENDING", "COMPLETED")
            and r.user.id = :userId
            and r.representative = true
    """)
    Optional<Report> findRepresentativeReport(@Param("userId") Long userId);

    /*
     TODO 수정 필요
     */
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("""
            update Report r
            set r.representative = false
            where r.user.id = :userId
            and r.representative = true
        """)
    void clearRepresentative(@Param("userId") Long userId);
}
