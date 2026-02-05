package com.bonetobe.backend.user.infrastructure;

import com.bonetobe.backend.common.SkeletonType;
import com.bonetobe.backend.user.domain.User;
import com.bonetobe.backend.user.domain.UserRepository;
import com.bonetobe.backend.user.domain.query.UserSearchSummaryRaw;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class UserRepositoryImpl implements UserRepository {
    private final UserJpaRepository jpaRepository;
    private final UserQueryDslRepository userQueryDslRepository;

    @Override
    public Optional<User> findById(Long id) {
        return jpaRepository.findById(id);
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return jpaRepository.findByEmailAndIsDeleted(email, false);
    }

    @Override
    public boolean existsByEmail(String email) {
        // 탈퇴 여부 상관없이 이메일 존재 여부만 체크 (재가입 방지)
        return jpaRepository.existsByEmail(email.trim());
    }

    @Override
    // 비밀번호 재설정 등에서 사용할 '활성 유저' 체크 메서드 추가
    public boolean existsActiveUserByEmail(String email) {
        return jpaRepository.existsByEmailAndIsDeleted(email.trim(), false);
    }

    @Override
    public boolean existsByNickname(String nickname) {
        // 탈퇴한 유저의 닉네임은 재사용할 수 없게 함
        return jpaRepository.existsByNicknameAndIsDeleted(nickname.trim(), false);
    }

    @Override
    public User save(User user) {
        return jpaRepository.save(user);
    }

    @Override
    public User update(User user) {
        return user;
    }

    @Override
    public List<User> findFollowingsByUserId(Long userId) {
        return jpaRepository.findFollowingsByUserId(userId);
    }

    @Override
    public List<User> findFollowersByUserId(Long userId) {
        return jpaRepository.findFollowersByUserId(userId);
    }

    @Override
    public List<UserSearchSummaryRaw> findUserSearch(String nickname, Long viewerId) {
        return userQueryDslRepository.findUserSearch(nickname, viewerId);
    }

    @Override
    public void updateSkeletonType(User user, SkeletonType skeletonType){
        user.updateSkeletonType(skeletonType);
    }
}
