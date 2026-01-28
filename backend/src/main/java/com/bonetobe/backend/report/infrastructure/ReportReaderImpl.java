package com.bonetobe.backend.report.infrastructure;

import com.bonetobe.backend.report.domain.Report;
import com.bonetobe.backend.report.domain.ReportReader;
import com.bonetobe.backend.report.presentation.ReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor

public class ReportReaderImpl implements ReportReader {
    private final ReportRepository reportRepository;
    @Override
    public Report read(Long reportId) {
        return reportRepository.findById(reportId).orElseThrow();
    }
}
