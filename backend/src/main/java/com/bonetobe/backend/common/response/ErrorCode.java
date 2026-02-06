package com.bonetobe.backend.common.response;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {

    // ================================
    // 1000번대 에러 코드 : 회원
    // ================================
    UNAUTHORIZED(1000, HttpStatus.UNAUTHORIZED, "사용자 인증이 필요합니다."),
    FORBIDDEN(1001, HttpStatus.FORBIDDEN, "사용 권한이 없습니다."),
    USER_NOT_FOUND(1002, HttpStatus.BAD_REQUEST, "해당 이메일로 가입된 사용자를 찾을 수 없습니다."),
    PASSWORD_SAME_AS_OLD(1003, HttpStatus.BAD_REQUEST, "기존 비밀번호와 동일한 비밀번호로 변경할 수 없습니다."),
    EMAIL_NOT_VERIFIED(1004, HttpStatus.BAD_REQUEST, "이메일 인증이 완료되지 않았습니다."),
    DUPLICATE_EMAIL(1005, HttpStatus.BAD_REQUEST, "이미 가입된 이메일입니다."),
    DUPLICATE_NICKNAME(1006, HttpStatus.BAD_REQUEST, "이미 사용 중인 닉네임입니다."),
    INVALID_EMAIL_OR_PASSWORD(1007, HttpStatus.UNAUTHORIZED, "이메일 또는 비밀번호가 일치하지 않습니다."),
    PASSWORD_MISMATCH(1008, HttpStatus.BAD_REQUEST, "비밀번호 확인이 일치하지 않습니다."),
    INVALID_RESET_TOKEN(1009, HttpStatus.BAD_REQUEST, "유효하지 않거나 만료된 비밀번호 재설정 토큰입니다."),
    SELF_FOLLOW_NOT_ALLOWED(1010, HttpStatus.BAD_REQUEST, "자기 자신은 팔로우할 수 없습니다."),
    ALREADY_FOLLOWING(1011, HttpStatus.BAD_REQUEST, "이미 팔로우한 유저입니다."),
    FOLLOW_NOT_FOUND(1012, HttpStatus.BAD_REQUEST, "팔로우를 찾을 수 없습니다."),


    // ================================
    // 2000번대 에러 코드 : 게시판
    // ================================

    // 2000~2009 : 조회 / 존재 / 접근
    POST_NOT_FOUND(2000, HttpStatus.NOT_FOUND, "게시글을 찾을 수 없습니다."),
    POST_ACCESS_DENIED(2001, HttpStatus.FORBIDDEN, "해당 게시글에 접근할 수 없습니다."),

    // 2010~2019 : 게시글 생성 필수값
    POST_CREATE_FILE_REQUIRED(2010, HttpStatus.BAD_REQUEST, "게시글에는 이미지 파일이 반드시 필요합니다."),
    POST_CREATE_CONTENT_REQUIRED(2011, HttpStatus.BAD_REQUEST, "게시글 내용은 비어 있을 수 없습니다."),
    POST_CREATE_GENDER_REQUIRED(2012, HttpStatus.BAD_REQUEST, "게시글에는 성별 정보가 반드시 필요합니다."),
    POST_CREATE_HEIGHT_REQUIRED(2013, HttpStatus.BAD_REQUEST, "게시글에는 키 정보가 반드시 필요합니다."),
    POST_CREATE_WEIGHT_REQUIRED(2014, HttpStatus.BAD_REQUEST, "게시글에는 몸무게 정보가 반드시 필요합니다."),
    POST_CREATE_CONTENT_LENGTH(2015, HttpStatus.BAD_REQUEST, "게시글 본문은 500자를 넘을 수 없습니다."),

    // 2020~2029 : 게시글 목록 조회 조건 검증
    POST_LIST_INVALID_SORT(2020, HttpStatus.BAD_REQUEST, "유효하지 않은 정렬 조건입니다."),
    POST_LIST_INVALID_STYLE(2021, HttpStatus.BAD_REQUEST, "유효하지 않은 스타일 값입니다."),
    POST_LIST_INVALID_GENDER(2022, HttpStatus.BAD_REQUEST, "유효하지 않은 성별 값입니다."),
    POST_LIST_INVALID_SKELETON_TYPE(2023, HttpStatus.BAD_REQUEST, "유효하지 않은 체형 값입니다."),
    POST_LIST_INVALID_RANGE(2024, HttpStatus.BAD_REQUEST, "유효하지 않은 범위 조건입니다."),
    POST_LIST_INVALID_LIKE(2025, HttpStatus.BAD_REQUEST, "게시글 좋아요 개수는 음수가 될 수 없습니다."),
    POST_DELETED(2026, HttpStatus.GONE, "삭제된 게시물입니다."),


    // 2030~2039 : 게시글 수정 / 삭제 권한
    POST_UPDATE_FORBIDDEN(2030, HttpStatus.FORBIDDEN, "본인이 작성한 게시글만 수정할 수 있습니다."),
    POST_DELETE_FORBIDDEN(2031, HttpStatus.FORBIDDEN, "본인이 작성한 게시글만 삭제할 수 있습니다."),

    // 2040~2049 : 게시글 좋아요 상태
    POST_ALREADY_LIKED(2040, HttpStatus.CONFLICT, "이미 좋아요를 누른 게시글입니다."),
    POST_LIKE_NOT_FOUND(2041, HttpStatus.NOT_FOUND, "좋아요를 누르지 않은 게시글입니다."),

    // 2050~2059 : 게시글 스크랩 상태
    POST_ALREADY_SCRAPPED(2050, HttpStatus.CONFLICT, "이미 스크랩한 게시글입니다."),
    POST_SCRAP_NOT_FOUND(2051, HttpStatus.NOT_FOUND, "스크랩하지 않은 게시글입니다."),

    // 2060~2069 : 댓글 관련
    REPLY_NOT_FOUND(2060, HttpStatus.NOT_FOUND, "댓글을 찾을 수 없습니다."),
    REPLY_CREATE_CONTENT_REQUIRED(2061, HttpStatus.BAD_REQUEST, "댓글 내용은 비어 있을 수 없습니다."),
    REPLY_DELETE_FORBIDDEN(2062, HttpStatus.FORBIDDEN, "본인이 작성한 댓글만 삭제할 수 있습니다."),
    REPLY_ALREADY_LIKED(2063, HttpStatus.CONFLICT, "이미 좋아요를 누른 댓글입니다."),
    REPLY_LIKE_NOT_FOUND(2064, HttpStatus.NOT_FOUND, "좋아요를 누르지 않은 댓글입니다."),
    REPLY_LIST_INVALID_LIKE(2065, HttpStatus.BAD_REQUEST, "댓글 좋아요 개수는 음수가 될 수 없습니다."),


    // ================================
    // 3000번대 에러 코드 : DB
    // ================================

    // ================================
    // 4000번대 에러 코드 : 파일 s3 버킷 업/다운로드
    // ================================
    NULL_FILE_NAME_EXCEPTION(4001, HttpStatus.BAD_REQUEST, "파일 이름이 비어있습니다."),
    S3_UPLOAD_FAIL_ERROR(4002, HttpStatus.INTERNAL_SERVER_ERROR, "S3 업로드에 실패했습니다."),
    FILE_NOT_CONFIRMED_EXCEPTION(4003, HttpStatus.BAD_REQUEST, "승인되지 않은 파일입니다."),
    FILE_NOT_FOUND(4004, HttpStatus.BAD_REQUEST, "파일이 존재하지 않습니다"),


    // ================================
    // 5000번대 에러 코드 : 리포트
    // ================================
    ALREADY_DELETED_EXCEPTION(5001, HttpStatus.BAD_REQUEST, "이미 삭제된 리포트입니다."),
    NOT_PENDING_REPORT(5002, HttpStatus.BAD_REQUEST, "이미 분석이 완료된 리포트입니다."),
    ALREADY_REPRESENTATIVE_EXCEPTION(5003, HttpStatus.BAD_REQUEST, "이미 대표 리포트입니다"),
    REPRESENTATION_NOT_FOUND_EXCEPTION(5004, HttpStatus.BAD_REQUEST, "대표 리포트를 찾을 수 없습니다."),
    NO_SUCH_REPPORT(5005, HttpStatus.BAD_REQUEST, "존재하지 않는 리포트입니다."),

    // 6000번대 코드 : 알림
    NOT_FOUND_NOTIFICATION(6001, HttpStatus.BAD_REQUEST, "존재하지 않는 알림입니다."),
    ALREADY_READ_NOTIFICATION(6002, HttpStatus.BAD_REQUEST, "이미 읽은 알림입니다."),

    // 7000 번대 코드 : try me
    NOT_FOUND_RECOMMENDATION(7001, HttpStatus.BAD_REQUEST, "존재하지 않는 가상피팅 입니다."),

    // 8000번대 코드 : 의류
    NOT_FOUND_CLOTH(8001, HttpStatus.BAD_REQUEST, "존재하지 않는 의상입니다."),
    // 10000 : 알 수 없는 예외

    // ================================
    // 10000번대 에러 코드 : 알 수 없는 에러
    // ================================
    UNKNOWN_ERROR(10000, HttpStatus.BAD_REQUEST, "알 수 없는 예외입니다,"),
    ENTITY_NOT_FOUND(10001, HttpStatus.BAD_REQUEST,"정보를 찾을 수 없습니다"),
    BAD_REQUEST(10002, HttpStatus.BAD_REQUEST, "잘못된 요청입니다."),
    INTERNAL_SERVER_ERROR(10003, HttpStatus.INTERNAL_SERVER_ERROR, "서버 내부 오류가 발생했습니다.");
    private final Integer code;
    private final HttpStatus status;
    private final String message;

    public int getStatusCode() {
        return status.value();
    }
}