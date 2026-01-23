package com.bonetobe.backend.common.exception;

import com.bonetobe.backend.common.response.APIResponse;
import com.bonetobe.backend.common.response.ErrorCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<APIResponse<Void>> handleBusiness(BusinessException e) {
        ErrorCode ec = e.getErrorCode();

        return ResponseEntity
                .status(ec.getStatus())
                .body(APIResponse.fail(ec));
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<APIResponse<Void>> handleTypeMismatch(MethodArgumentTypeMismatchException e) {
        ErrorCode ec = ErrorCode.BAD_REQUEST;
        return ResponseEntity
                .status(ec.getStatus())
                .body(APIResponse.fail(ec));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<APIResponse<Void>> handleUnexpected(Exception e) {
        ErrorCode ec = ErrorCode.INTERNAL_SERVER_ERROR;

        return ResponseEntity
                .status(ec.getStatus())
                .body(APIResponse.fail(ec));
    }
}
