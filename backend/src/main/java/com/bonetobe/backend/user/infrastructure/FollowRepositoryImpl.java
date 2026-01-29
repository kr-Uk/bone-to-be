package com.bonetobe.backend.user.infrastructure;

import com.bonetobe.backend.user.domain.Follow;
import com.bonetobe.backend.user.domain.FollowRepository;
import com.bonetobe.backend.user.domain.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class FollowRepositoryImpl implements FollowRepository {
    private final FollowJpaRepository jpaRepository;

    @Override
    public Optional<Follow> findByFollowingIdAndFollowerId(Long followingId, Long followerId) {
        return jpaRepository.findByFollowingIdAndFollowerId(followingId, followerId);
    }

    @Override
    public boolean existsByFollowingIdAndFollowerId(Long followingId, Long followerId) {
        return jpaRepository.existsByFollowingIdAndFollowerId(followingId, followerId);
    }

    @Override
    public Follow save(Follow follow) {
        return jpaRepository.save(follow);
    }

    @Override
    public void delete(Follow follow) {
        jpaRepository.delete(follow);
    }
}
