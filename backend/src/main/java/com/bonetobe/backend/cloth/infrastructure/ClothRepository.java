package com.bonetobe.backend.cloth.infrastructure;

import com.bonetobe.backend.cloth.domain.Cloth;
import com.bonetobe.backend.common.SkeletonType;
import com.bonetobe.backend.style.domain.StyleName;
import com.bonetobe.backend.user.domain.Gender;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ClothRepository extends JpaRepository<Cloth, Long> {
    Optional<Cloth> findByBestSkeletonTypeAndGenderAndStyle(SkeletonType bestSkeletonType, Gender gender, StyleName styleName);

    Optional<Cloth> findByWorstSkeletonTypeAndGenderAndStyle(SkeletonType worstSkeletonType, Gender gender, StyleName styleName);
}
