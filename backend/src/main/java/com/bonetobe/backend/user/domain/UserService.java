package com.bonetobe.backend.user.domain;

import com.bonetobe.backend.user.domain.command.UserFileCommand;
import com.bonetobe.backend.user.domain.query.UserFileSummary;
import com.bonetobe.backend.user.presentation.dto.UserDetailDto;

public interface UserService {
    UserFileSummary issueProfilePresignedUrl(UserFileCommand command);
    void updatePassword(UserUpdateCommand command);
    void deleteAccount(Long userId);
    User getUserById(Long userId);
    UserDetailDto getUserDetail(Long userId);
}
