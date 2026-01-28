package com.bonetobe.backend.report.domain;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
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
}
