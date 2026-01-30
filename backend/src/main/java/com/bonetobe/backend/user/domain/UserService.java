package com.bonetobe.backend.user.domain;

import com.bonetobe.backend.user.domain.command.UpdateMyPageCommand;
import com.bonetobe.backend.user.domain.command.UserFileCommand;
import com.bonetobe.backend.user.domain.command.UserUpdateCommand;
import com.bonetobe.backend.user.domain.query.UserFileSummary;
import com.bonetobe.backend.user.domain.query.UserSearchSummaryRaw;
import com.bonetobe.backend.user.presentation.dto.UserDetailDto;

import java.util.List;

public interface UserService {
    UserFileSummary issueProfilePresignedUrl(UserFileCommand command);

    void updatePassword(UserUpdateCommand command);

    void deleteAccount(Long userId);

    User getUserById(Long userId);

    UserDetailDto getUserDetail(Long userId);

    void updateMyPage(UpdateMyPageCommand command);

    List<UserSearchSummaryRaw> getUserSearch(String nickname, Long viewerId);
}
