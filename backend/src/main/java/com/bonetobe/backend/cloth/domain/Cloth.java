package com.bonetobe.backend.cloth.domain;

import com.bonetobe.backend.common.BaseEntity;
import com.bonetobe.backend.common.SkeletonType;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class Cloth extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(value = EnumType.STRING)
    private ClothType clothType;

    @Enumerated(value = EnumType.STRING)
    @Column(name = "best_skeleton_type")
    private SkeletonType bestSkeletonType;

    @Enumerated(value = EnumType.STRING)
    @Column(name = "worst_skeleton_type")
    private SkeletonType worstSkeletonType;
}
