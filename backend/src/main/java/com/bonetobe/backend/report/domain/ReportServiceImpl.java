package com.bonetobe.backend.report.domain;

import com.bonetobe.backend.common.exception.BusinessException;
import com.bonetobe.backend.common.response.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReportServiceImpl implements ReportService {
    private final ReportStore reportStore;
    private final ReportReader reportReader;

    @Override
    @Transactional
    public Report saveReport(ReportCommand command) {
        return reportStore.save(Report.startReport(command.user(), command.bodyInfo()));
    }

    @Override
    @Transactional
    public Report saveResult(Long reportId, List<AnalysisDetail> analysisReport) {
        Report report = reportReader.read(reportId);
        report.completeReport(analysisReport);
        return reportStore.update(report);
    }

    @Override
    public Report getReport(Long reportId, Long userId) {
        Report report = reportReader.read(reportId);
        if (!report.getUser().getId().equals(userId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }

        return report;
    }

    @Override
    public List<Report> getReportList(Long userId) {
        return reportReader.readReports(userId);
    }

    @Override
    public Report isOwner(Long userId, Long reportId) {
        Report report = reportReader.read(reportId);
        if (!Objects.equals(report.getUser().getId(), userId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }
        return report;
    }

    @Override
    @Transactional
    public void delete(Report report) {
        report.softDelete();
        reportStore.update(report);
    }
}
