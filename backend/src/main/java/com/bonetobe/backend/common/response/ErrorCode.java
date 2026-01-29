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

    // 2000번대 코드 : 게시판 관련
    POST_LIST_INVALID_SORT(2000, HttpStatus.BAD_REQUEST, "유효하지 않은 정렬 조건입니다."),
    POST_LIST_INVALID_STYLE(2001, HttpStatus.BAD_REQUEST, "유효하지 않은 스타일 값입니다."),
    POST_LIST_INVALID_GENDER(2002, HttpStatus.BAD_REQUEST, "유효하지 않은 성별 값입니다."),
    POST_LIST_INVALID_SKELETON_TYPE(2003, HttpStatus.BAD_REQUEST, "유효하지 않은 체형 값입니다."),
    POST_LIST_INVALID_RANGE(2004, HttpStatus.BAD_REQUEST, "유효하지 않은 범위 조건입니다."),
    POST_LIST_INVALID_LIKE(2005, HttpStatus.BAD_REQUEST, "좋아요 개수는 음수가 될 수 없습니다."),
    POST_NOT_FOUND(2006, HttpStatus.BAD_REQUEST, "게시글을 찾을 수 없습니다."),
    POST_CREATE_FILE_REQUIRED(2007, HttpStatus.BAD_REQUEST, "게시글에는 이미지 파일이 반드시 필요합니다."),
    POST_CREATE_CONTENT_REQUIRED(2008, HttpStatus.BAD_REQUEST, "게시글 내용은 비어 있을 수 없습니다."),
    POST_CREATE_GENDER_REQUIRED(2009, HttpStatus.BAD_REQUEST, "게시글에는 성별 정보가 반드시 필요합니다."),
    POST_CREATE_HEIGHT_REQUIRED(2010, HttpStatus.BAD_REQUEST, "게시글에는 키 정보가 반드시 필요합니다."),
    POST_CREATE_WEIGHT_REQUIRED(2011, HttpStatus.BAD_REQUEST, "게시글에는 몸무게 정보가 반드시 필요합니다."),


    // 3000번대 코드 : DB 관련

    // 4000번대 코드 : 파일 s3 버킷 업/다운로드 관련
    NULL_FILE_NAME_EXCEPTION(4001, HttpStatus.BAD_REQUEST, "파일 이름이 비어있습니다."),
    S3_UPLOAD_FAIL_ERROR(4002, HttpStatus.INTERNAL_SERVER_ERROR, "S3 업로드에 실패했습니다."),
    FILE_NOT_CONFIRMED_EXCEPTION(4003, HttpStatus.BAD_REQUEST, "승인되지 않은 파일입니다."),
    FILE_NOT_FOUND(4004, HttpStatus.BAD_REQUEST, "파일이 존재하지 않습니다"),


    // 5000번대 코드 : 리포트
    ALREADY_DELETED_EXCEPTION(5001, HttpStatus.BAD_REQUEST, "이미 삭제된 리포트입니다."),
    NOT_PENDING_REPORT(5002, HttpStatus.BAD_REQUEST, "이미 분석이 완료된 리포트입니다."),
    ALREADY_REPRESENTATIVE_EXCEPTION(5003, HttpStatus.BAD_REQUEST, "이미 대표 리포트입니다"),
    REPRESENTATION_NOT_FOUND_EXCEPTION(5004, HttpStatus.BAD_REQUEST, "대표 리포트를 찾을 수 없습니다."),
    NO_SUCH_REPPORT(5005, HttpStatus.BAD_REQUEST, "존재하지 않는 리포트입니다."),
    // 10000 : 알 수 없는 예외
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