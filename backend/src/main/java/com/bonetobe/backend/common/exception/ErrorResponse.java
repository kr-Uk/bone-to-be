package com.bonetobe.backend.common.exception;

public record ErrorResponse(
        int code,
        String message
) {}
