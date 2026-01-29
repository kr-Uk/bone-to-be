package com.bonetobe.backend.user.domain;

import com.bonetobe.backend.common.exception.BusinessException;
import com.bonetobe.backend.common.response.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FollowServiceImpl implements FollowService{

    private final FollowRepository followRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public void follow(Long followingId, Long followerId) {
        // 1. 이미 팔로우 상태인지 확인 (중복 방지)
        if (followRepository.existsByFollowingIdAndFollowerId(followingId, followerId)) {
            throw new BusinessException(ErrorCode.ALREADY_FOLLOWING);
        }

        // 2. 대상 유저 존재 확인
        User following = userRepository.findById(followingId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
        User follower = userRepository.findById(followerId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        // 3. 정적 팩토리 메서드를 통한 생성 (내부에서 자기 자신 팔로우 검증 수행)
        Follow newFollow = Follow.createFollow(follower, following);

        followRepository.save(newFollow);
    }

    @Override
    @Transactional
    public void unfollow(Long followingId, Long followerId) {
        // 관계를 찾아 삭제합니다.
        Follow follow = followRepository.findByFollowingIdAndFollowerId(followingId, followerId)
                .orElseThrow(() -> new RuntimeException("팔로우 관계가 존재하지 않습니다."));

        followRepository.delete(follow);
    }
}
