package com.bonetobe.backend.common.exception;

import com.bonetobe.backend.common.response.APIResponse;
import com.bonetobe.backend.common.response.ErrorCode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

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
    public ResponseEntity<ErrorResponse> handleBusiness(BusinessException e) {
        ErrorCode ec = e.getErrorCode();
        return ResponseEntity
            .status(ec.getStatus())
            .body(new ErrorResponse(ec.getCode(), ec.getMessage()));
    }

    // 예상치 못한 에러 처리
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleUnexpected(Exception e) {

        return ResponseEntity
            .internalServerError()
            .body(new ErrorResponse(9999, "서버 오류가 발생했습니다."));
    }
}