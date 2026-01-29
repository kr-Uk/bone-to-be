package com.bonetobe.backend.user.presentation.dto;

import com.bonetobe.backend.common.annotation.Password;
import com.bonetobe.backend.user.domain.command.UpdateMyPageCommand;
import com.bonetobe.backend.user.domain.command.UserUpdateCommand;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

public class UpdateUser {

    @Getter
    public static class PasswordRequest {
        @NotBlank(message = "현재 비밀번호를 입력해주세요.")
        private String currentPassword;

        @NotBlank(message = "새 비밀번호는 필수 입력 항목입니다.")
        @Password
        private String newPassword;

        @NotBlank(message = "비밀번호 확인을 입력해주세요.")
        private String newPasswordConfirm;

        public UserUpdateCommand toCommand(Long userId) {
            return UserUpdateCommand.builder()
                    .userId(userId)
                    .currentPassword(currentPassword)
                    .newPassword(newPassword)
                    .newPasswordConfirm(newPasswordConfirm)
                    .build();
        }
    }

    public record Request(
            @NotBlank String nickname,
            String bio,
            Long profileImageId // 이미지 변경 시 업로드 후 받은 fileId
    ) {
        public UpdateMyPageCommand toCommand(Long userId) {
            return new UpdateMyPageCommand(userId, nickname, bio, profileImageId);
        }
    }
}