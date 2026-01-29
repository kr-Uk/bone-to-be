package com.bonetobe.backend.report.domain;

import com.bonetobe.backend.report.infrastructure.ReportMessage;

public interface ReportProducer {
    void produce(ReportMessage.Request request);
}
