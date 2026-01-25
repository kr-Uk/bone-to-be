package com.bonetobe.backend.common.response;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {

    // 1000번대 코드 : 회원 관련
    UNAUTHORIZED(1000, HttpStatus.UNAUTHORIZED, "사용자 인증이 필요합니다."),
    FORBIDDEN(1001, HttpStatus.FORBIDDEN, "사용 권한이 없습니다."),

    // 2000번대 코드 : 게시판 관련
    POST_LIST_INVALID_SORT(2000, HttpStatus.BAD_REQUEST, "유효하지 않은 정렬 조건입니다."),
    POST_LIST_INVALID_STYLE(2001, HttpStatus.BAD_REQUEST, "유효하지 않은 스타일 값입니다."),
    POST_LIST_INVALID_GENDER(2002, HttpStatus.BAD_REQUEST, "유효하지 않은 성별 값입니다."),
    POST_LIST_INVALID_RANGE(2003, HttpStatus.BAD_REQUEST, "유효하지 않은 범위 조건입니다."),
    POST_LIST_INVALID_LIKE(2004, HttpStatus.BAD_REQUEST, "좋아요 개수는 음수가 될 수 없습니다."),
    POST_NOT_FOUND(2005, HttpStatus.BAD_REQUEST, "게시글을 찾을 수 없습니다."),
    POST_CREATE_FILE_REQUIRED(2006, HttpStatus.BAD_REQUEST, "게시글에는 이미지 파일이 반드시 필요합니다."),
    POST_CREATE_CONTENT_REQUIRED(2007, HttpStatus.BAD_REQUEST, "게시글 내용은 비어 있을 수 없습니다."),

    // 3000번대 코드 : DB 관련

    // 4000번대 코드 : 파일 s3 버킷 업/다운로드 관련
    NULL_FILE_NAME_EXCEPTION(4001, HttpStatus.BAD_REQUEST, "파일 이름이 비어있습니다."),
    S3_UPLOAD_FAIL_ERROR(4002, HttpStatus.INTERNAL_SERVER_ERROR, "S3 업로드에 실패했습니다."),
    FILE_NOT_CONFIRMED_EXCEPTION(4003, HttpStatus.BAD_REQUEST, "승인되지 않은 파일입니다."),


    // 5000번대 코드 : AI
    INTERNAL_SERVER_ERROR(5001, HttpStatus.INTERNAL_SERVER_ERROR, "서버 내부 오류가 발생했습니다."),


    // 10000 : 알 수 없는 예외
    UNKNOWN_ERROR(10000, HttpStatus.BAD_REQUEST, "알 수 없는 예외입니다,"),
    ENTITY_NOT_FOUND(10001, HttpStatus.BAD_REQUEST,"정보를 찾을 수 없습니다"),
    BAD_REQUEST(10002, HttpStatus.BAD_REQUEST, "잘못된 요청입니다.");

    private final Integer code;
    private final HttpStatus status;
    private final String message;

    public int getStatusCode() {
        return status.value();
    }
}