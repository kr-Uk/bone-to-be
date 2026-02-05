package com.bonetobe.backend.cloth.domain;

import com.bonetobe.backend.common.BaseEntity;
import com.bonetobe.backend.common.SkeletonType;
import com.bonetobe.backend.file.domain.StoredFile;
import com.bonetobe.backend.style.domain.StyleName;
import com.bonetobe.backend.user.domain.Gender;
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
    @Column(name = "best_skeleton_type")
    private SkeletonType bestSkeletonType;

    @Enumerated(value = EnumType.STRING)
    @Column(name = "worst_skeleton_type")
    private SkeletonType worstSkeletonType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "file_id")
    private StoredFile file;

    @Enumerated(EnumType.STRING)
    private StyleName style;

    @Enumerated
    private Gender gender;

    public static Cloth of(Long clothId) {
        Cloth cloth = new Cloth();
        cloth.id = clothId;
        return cloth;
    }
}
