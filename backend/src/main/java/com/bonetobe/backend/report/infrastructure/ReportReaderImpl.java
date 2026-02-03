package com.bonetobe.backend.report.infrastructure;

import com.bonetobe.backend.common.exception.BusinessException;
import com.bonetobe.backend.common.response.ErrorCode;
import com.bonetobe.backend.report.domain.Report;
import com.bonetobe.backend.report.domain.ReportReader;
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
        return reportRepository.findByIdAndActive(reportId).orElseThrow(() -> new BusinessException(ErrorCode.NO_SUCH_REPPORT));
    }

    @Override
    public List<Report> readReports(Long id) {
        return reportRepository.findByUserOrderByCreatedAtDesc(User.of(id));
    }

    @Override
    public Optional<Report> readRepresentativeReport(Long userId) {
        return reportRepository.findRepresentativeReport(userId);
    }

    @Override
    public Report readWithFile(Long reportId) {
        return reportRepository.findByIdAndActiveWithFile(reportId).orElseThrow(() -> new BusinessException(ErrorCode.NO_SUCH_REPPORT));
    }
}
