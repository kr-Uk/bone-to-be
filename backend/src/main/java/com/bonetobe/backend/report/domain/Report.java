package com.bonetobe.backend.report.domain;

import com.bonetobe.backend.common.BaseEntity;
import com.bonetobe.backend.file.domain.StoredFile;
import com.bonetobe.backend.user.domain.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class Report extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "photo_id")
    private StoredFile photo;

    @Embedded
    private BodyInfo bodyInfo;

    @Embedded
    private Diagnosis diagnosis;

    @Column(name = "status", nullable = false)
    private ReportStatus status = ReportStatus.PENDING;

    private String description;

    @Column(name = "is_representative", nullable = false)
    private boolean representative = false;

    public static Report startReport(
        User user,
        BodyInfo bodyInfo
    ) {
        Report report = new Report();
        report.user = user;
        report.bodyInfo = bodyInfo;
        return report;
    }
}
