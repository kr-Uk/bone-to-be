package com.bonetobe.backend.notification.domain;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public enum AlertType {
    DIAGNOSE("체형 진단", "체형 분석이 완료되었습니다."),
    TRY_ME("가상 피팅", "가상 피팅이 완료되었습니다.");

    private final String name;
    private final String message;
}
