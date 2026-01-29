package com.bonetobe.backend.user.presentation.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;

public class LoginUser {

    @Getter
    @NoArgsConstructor
    @Schema(name = "UserLoginRequest")
    public static class Request {
        @NotBlank(message = "이메일은 필수입니다.")
        @Email(message = "이메일 형식이 올바르지 않습니다.")
        private String email;

        @NotBlank(message = "비밀번호는 필수입니다.")
        private String password;
    }

    // 로그인 성공 시 세션 정보를 프론트에 넘겨줄 필요가 있다면 추가
    @Getter
    @NoArgsConstructor
    @Schema(name = "UserLoginResponse")
    public static class Response {
        private String email;
        private String nickname;

        public Response(String email, String nickname) {
            this.email = email;
            this.nickname = nickname;
        }
    }
}