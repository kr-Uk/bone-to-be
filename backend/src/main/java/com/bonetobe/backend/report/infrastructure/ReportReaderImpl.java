package com.bonetobe.backend.report.infrastructure;

import com.bonetobe.backend.report.domain.Report;
import com.bonetobe.backend.report.domain.ReportReader;
import com.bonetobe.backend.report.presentation.ReportRepository;
import com.bonetobe.backend.user.domain.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor

public class ReportReaderImpl implements ReportReader {
    private final ReportRepository reportRepository;
    @Override
    public Report read(Long reportId) {
        return reportRepository.findByIdAndActive(reportId).orElseThrow();
    }

    @Override
    public List<Report> readReports(Long id) {
        return reportRepository.findByUserOrderByCreatedAtDesc(User.of(id));
    }
}
