package com.bonetobe.backend.report.domain;

import com.bonetobe.backend.common.BaseEntity;
import com.bonetobe.backend.common.exception.BusinessException;
import com.bonetobe.backend.common.response.ErrorCode;
import com.bonetobe.backend.file.domain.StoredFile;
import com.bonetobe.backend.style.domain.StyleName;
import com.bonetobe.backend.user.domain.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.List;

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

    @Enumerated(EnumType.STRING)
    private StyleName styleName;

    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    private ReportStatus status = ReportStatus.PENDING;

    private String description;

    @Column(name = "is_representative", nullable = false)
    private boolean representative = false;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private List<AnalysisDetail> analysisReport;

    public static Report startReport(
        User user,
        BodyInfo bodyInfo,
        StyleName styleName,
        Long fileId
    ) {
        Report report = new Report();
        report.user = user;
        report.styleName = StyleName.ANY;
        if (styleName != null) {
            report.styleName = styleName;
        }
        report.bodyInfo = bodyInfo;
        report.photo = StoredFile.of(fileId);
        return report;
    }

    public static Report of(Long reportId) {
        Report report = new Report();
        report.id = reportId;
        return report;
    }

    public void completeReport(List<AnalysisDetail> report) {
        if (status != ReportStatus.PENDING) {
            throw new BusinessException(ErrorCode.NOT_PENDING_REPORT);
        }
        diagnosis = Diagnosis.calculateRatio(report);
        analysisReport = report;
        status = ReportStatus.COMPLETED;
    }

    public Diagnosis getDiagnosis(ReportStatus status) {
        if (status == ReportStatus.PENDING) {
            return null;
        }

        return diagnosis;
    }

    public void softDelete() {
        if(status == ReportStatus.DELETED) {
            throw new BusinessException(ErrorCode.ALREADY_DELETED_EXCEPTION);
        }
        status = ReportStatus.DELETED;
    }

    public void toggleRepresentative() {
        if(isRepresentative()) {
            representative = false;
            return;
        }

        representative = true;
    }
}
