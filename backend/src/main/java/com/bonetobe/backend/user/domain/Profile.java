package com.bonetobe.backend.user.domain;

import com.bonetobe.backend.common.BaseEntity;
import com.bonetobe.backend.common.SkeletonType;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Objects;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class Profile extends BaseEntity {
    @Id
    private Long id;

    @MapsId
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    private Integer height;

    private Integer weight;

    @Enumerated(EnumType.STRING)
    private SkeletonType type;

    public Profile(User user) {
        this.user = Objects.requireNonNull(user);
    }
}
