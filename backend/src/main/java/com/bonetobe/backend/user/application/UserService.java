package com.bonetobe.backend.user.application;

import com.bonetobe.backend.user.domain.UserUpdateCommand;
import com.bonetobe.backend.user.presentation.UpdateUser;

public interface UserService {
    void updatePassword(UserUpdateCommand command);
    void deleteAccount(Long userId);
    // UpdateUser.PresignedUrlResponse generatePresignedUrl(Long userId, UpdateUser.PresignedUrlRequest request);
    void updateInfo(Long userId, UpdateUser.InfoRequest request);
}
