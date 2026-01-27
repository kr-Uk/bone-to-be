package com.bonetobe.backend.user.presentation;

import com.bonetobe.backend.common.annotation.Nickname;
import com.bonetobe.backend.common.annotation.Password;
import com.bonetobe.backend.user.domain.User;
import com.bonetobe.backend.user.domain.UserCreateCommand;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

public class AddUser {

    @Getter
    @Schema(name = "UserSignupRequest")
    public static class Request {
        @NotBlank(message = "닉네임은 필수 입력 항목입니다.")
        @Nickname
        private String nickname;

        @NotBlank(message = "이메일은 필수 입력 항목입니다.")
        @Email(message = "올바른 이메일 형식이 아닙니다.")
        private String email;

        @NotBlank(message = "인증코드를 입력해주세요.")
        private String authCode;

        @NotBlank(message = "비밀번호는 필수 입력 항목입니다.")
        @Password
        private String password;

        @NotBlank(message = "비밀번호 확인을 입력해주세요.")
        private String passwordConfirm;


        public UserCreateCommand toCommand() {
            return UserCreateCommand.builder()
                    .email(email)
                    .password(password)
                    .passwordConfirm(passwordConfirm)
                    .nickname(nickname)
                    .authCode(authCode)
                    .build(); // 이 시점에 내부적으로 validate 로직이 실행됨
        }
    }

    @Getter
    @Builder
    @Schema(name = "UserSignupResponse")
    public static class Response {
        private Long id;
        private String email;
        private String nickname;

        // 엔티티를 DTO로 변환하는 정적 메서드
        public static Response from(User user) {
            return Response.builder()
                    .id(user.getId())
                    .email(user.getEmail())
                    .nickname(user.getNickname())
                    .build();
        }
    }

    @Getter
    @AllArgsConstructor
    public static class NicknameCheckResponse {
        private boolean hasNickname;

        public static NicknameCheckResponse from(boolean hasNickname) {
            return new NicknameCheckResponse(hasNickname);
        }
    }

    @Getter
    @AllArgsConstructor
    public static class EmailCheckResponse {
        private boolean hasEmail;

        public static EmailCheckResponse from(boolean hasEmail) {
            return new EmailCheckResponse(hasEmail);
        }
    }

    @Getter
    public static class EmailRequest {
        @Email
        @NotBlank
        private String email;
    }

    @Getter
    public static class EmailVerificationRequest {
        @Email
        @NotBlank
        private String email;

        @NotBlank
        private String code;
    }

    @Getter
    @AllArgsConstructor
    public static class EmailVerificationResponse {
        private boolean isValid;

        public static EmailVerificationResponse from(boolean isValid) {
            return new EmailVerificationResponse(isValid);
        }
    }
}