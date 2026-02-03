package com.bonetobe.backend.user.infrastructure;

import com.bonetobe.backend.user.domain.query.UserSearchSummaryRaw;

import java.util.List;

public interface UserQueryDslRepository {
    List<UserSearchSummaryRaw> findUserSearch(String nickname, Long viewerId);
}
