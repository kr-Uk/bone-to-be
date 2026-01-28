package com.bonetobe.backend.user.domain;

import com.bonetobe.backend.user.domain.command.UserFileCommand;
import com.bonetobe.backend.user.domain.query.UserFileSummary;

public interface UserService {
    UserFileSummary issueProfilePresignedUrl(UserFileCommand command);
    void updatePassword(UserUpdateCommand command);
    void deleteAccount(Long userId);
    User getUserById(Long userId);
}
