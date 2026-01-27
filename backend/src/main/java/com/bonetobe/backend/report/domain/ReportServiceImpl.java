package com.bonetobe.backend.report.domain;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {
    private final ReportStore reportStore;

    @Override
    @Transactional
    public Report saveReport(ReportCommand command) {
        return reportStore.save(Report.startReport(command.user(), command.bodyInfo()));
    }
}
