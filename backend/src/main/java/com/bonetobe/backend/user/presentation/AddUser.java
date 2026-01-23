package com.bonetobe.backend.user.presentation;

import com.bonetobe.backend.user.domain.User;
import com.bonetobe.backend.user.domain.UserCreateCommand;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

public class AddUser {

    @Getter
    public static class Request {
        @NotBlank(message = "닉네임은 필수 입력 항목입니다.")
        private String nickname;

        @NotBlank(message = "이메일은 필수 입력 항목입니다.")
        @Email(message = "올바른 이메일 형식이 아닙니다.") // 이메일 형식 검증
        private String email;

        @NotBlank(message = "인증코드를 입력해주세요.")
        private String authCode;

        @NotBlank(message = "비밀번호는 필수 입력 항목입니다.")
        @Pattern(
                regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,20}$",
                message = "비밀번호는 8~20자의 영문 대/소문자, 숫자, 특수문자를 포함해야 합니다."
        )
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
                    .build();
        }
    }

    @Getter
    @Builder
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
    @AllArgsConstructor
    public static class EmailVerificationResponse {
        private boolean isValid;

        public static EmailVerificationResponse from(boolean isValid) {
            return new EmailVerificationResponse(isValid);
        }
    }
}