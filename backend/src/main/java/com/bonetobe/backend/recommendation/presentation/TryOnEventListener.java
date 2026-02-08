package com.bonetobe.backend.recommendation.presentation;

import com.bonetobe.backend.recommendation.application.TryOnFacade;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
@RequiredArgsConstructor
public class TryOnEventListener {
    private final TryOnFacade tryOnFacade;

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void tryOnListen(TryOnEvent tryOnEvent) {
        tryOnFacade.startTryOn(tryOnEvent.reportId());
    }
}
