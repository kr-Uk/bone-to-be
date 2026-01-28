package com.bonetobe.backend.report.infrastructure;

import com.bonetobe.backend.report.domain.Report;
import com.bonetobe.backend.report.domain.ReportStore;
import com.bonetobe.backend.report.presentation.ReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ReportStoreImpl implements ReportStore {
    private final ReportRepository reportRepository;
    @Override
    public Report save(Report report) {
        return reportRepository.save(report);
    }
}
