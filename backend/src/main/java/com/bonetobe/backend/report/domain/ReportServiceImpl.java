package com.bonetobe.backend.report.domain;

import com.bonetobe.backend.user.domain.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {
    private final ReportPublisher reportPublisher;
    private final ReportStore reportStore;

    @Override
    public void generateReport(User user, String presignedUrl) {
        Report report = Report.startReport(user);
        reportPublisher.publish(user.getId(), presignedUrl);
        reportStore.save(report);
    }
}
