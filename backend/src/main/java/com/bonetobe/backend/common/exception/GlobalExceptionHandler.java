package com.bonetobe.backend.common.exception;

import com.bonetobe.backend.common.response.APIResponse;
import com.bonetobe.backend.common.response.ErrorCode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * @Valid 검증 실패 시 (MethodArgumentNotValidException) 처리
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<APIResponse<Void>> handleMethodArgumentNotValidException(MethodArgumentNotValidException e) {
        // 1. 발생한 에러 메시지 중 첫 번째 것을 추출 (예: "비밀번호는 8~20자의...")
        String originalMessage = e.getBindingResult().getAllErrors().get(0).getDefaultMessage();

        log.warn("[Validation Error] 상세 내용: {}", originalMessage);

        // 2. ErrorCode.BAD_REQUEST(10002)를 기본으로 하되, 메시지만 커스텀하게 실어서 반환
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(APIResponse.fail(ErrorCode.BAD_REQUEST, originalMessage));
    }

    /**
     * 비즈니스 로직 중 발생하는 일반적인 예외 처리 (IllegalArgumentException 등)
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<APIResponse<Void>> handleIllegalArgumentException(IllegalArgumentException e) {
        log.warn("[Business Error] 메시지: {}", e.getMessage());

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(APIResponse.fail(ErrorCode.BAD_REQUEST, e.getMessage()));
    }

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<APIResponse<Void>> handleBusiness(BusinessException e) {
        ErrorCode ec = e.getErrorCode();

        log.warn("[Business Error] 상세 내용: {}", e.getMessage());
        return ResponseEntity
                .status(ec.getStatus())
                .body(APIResponse.fail(ec));
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<APIResponse<Void>> handleTypeMismatch(MethodArgumentTypeMismatchException e) {
        ErrorCode ec = ErrorCode.BAD_REQUEST;
        log.warn("[TypeMismatch Error] 상세 내용: {}", e.getMessage());
        return ResponseEntity
                .status(ec.getStatus())
                .body(APIResponse.fail(ec));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<APIResponse<Void>> handleUnexpected(Exception e) {
        ErrorCode ec = ErrorCode.INTERNAL_SERVER_ERROR;
        log.warn("[Unknown Error] 상세 내용: {}", e.getMessage());
        return ResponseEntity
                .status(ec.getStatus())
                .body(APIResponse.fail(ec));
    }
}