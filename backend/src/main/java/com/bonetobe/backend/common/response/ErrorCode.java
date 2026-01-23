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

    // 3000번대 코드 : DB 관련

    // 4000번대 코드 : 파일 s3 버킷 업/다운로드 관련
    FILE_UPLOAD_FAIL_ERROR(4000, HttpStatus.INTERNAL_SERVER_ERROR, "파일 업로드에 실패했습니다."),
    FILE_NOT_EXIST_ERROR(4001, HttpStatus.BAD_REQUEST, "빈 파일이거나 존재하지 않는 파일입니다."),
    INVALID_FILE_NAME_ERROR(4002, HttpStatus.BAD_REQUEST, "파일명이 비었거나 유효하지 않습니다."),
    INVALID_FILE_CATEGORY_ERROR(4003, HttpStatus.BAD_REQUEST, "파일 카테고리가 유효하지 않습니다."),
    FORMAT_NOT_PERMITTED_ERROR(4004, HttpStatus.BAD_REQUEST, "유효하지 않은 파일 타입입니다."),
    MIME_NOT_PERMITTED_ERROR(4005, HttpStatus.BAD_REQUEST, "유효하지 않은 MIME 타입입니다."),
    FILE_SIZE_EXCEED_ERROR(4006, HttpStatus.BAD_REQUEST, "파일 사이즈가 초과되었습니다."),
    S3_UPLOAD_FAIL_ERROR(4007, HttpStatus.INTERNAL_SERVER_ERROR, "S3 업로드에 실패했습니다."),
    LOGO_ALREADY_EXIST_ERROR(4008, HttpStatus.BAD_REQUEST, "회사 로고가 존재합니다."),
    FILE_QUANTITY_EXCEED_ERROR(4009, HttpStatus.BAD_REQUEST, "업로드할 파일 갯수가 10개를 초과했습니다."),
    FILE_METADATA_HASHING_FAILURE(4010, HttpStatus.INTERNAL_SERVER_ERROR, "DB 파일 메타데이터 해싱에 실패했습니다."),
    CLIENT_FILE_HASHING_FAILURE(4011, HttpStatus.INTERNAL_SERVER_ERROR, "클라이언트 파일 메타데이터 해싱에 실패했습니다."),

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