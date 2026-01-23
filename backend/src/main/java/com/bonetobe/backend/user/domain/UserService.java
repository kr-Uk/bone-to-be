package com.bonetobe.backend.user.domain;

import com.bonetobe.backend.user.presentation.AddUserRequest;

public interface UserService {
    boolean existsByEmail(String email); // 1. 이메일 중복 확인
    boolean existsByNickname(String nickname); // 2. 닉네임 중복 확인
    Long save(AddUserRequest dto); // 3. 회원 정보 저장 (회원가입)
}
