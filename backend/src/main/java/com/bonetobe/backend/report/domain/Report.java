package com.bonetobe.backend.report.domain;

import com.bonetobe.backend.common.BaseEntity;
import com.bonetobe.backend.common.exception.BusinessException;
import com.bonetobe.backend.common.response.ErrorCode;
import com.bonetobe.backend.file.domain.StoredFile;
import com.bonetobe.backend.user.domain.User;
import com.vladmihalcea.hibernate.type.json.JsonBinaryType;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Type;

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

    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    private ReportStatus status = ReportStatus.PENDING;

    private String description;

    @Column(name = "is_representative", nullable = false)
    private boolean representative = false;

    @Type(JsonBinaryType.class)
    @Column(columnDefinition = "jsonb")
    private List<AnalysisDetail> analysisReport;

    public static Report startReport(
        User user,
        BodyInfo bodyInfo
    ) {
        Report report = new Report();
        report.user = user;
        report.bodyInfo = bodyInfo;
        /*
            TODO : 첫 리포트인 경우 representative 를 첫 리포트로 등록하는 로직 추가
         */
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

    public void makeRepresentative() {
        if(isRepresentative()) {
            throw new BusinessException(ErrorCode.ALREADY_REPRESENTATIVE_EXCEPTION);
        }

        representative = true;
    }

    public void revokeRepresentative() {
        representative = false;
    }
}
