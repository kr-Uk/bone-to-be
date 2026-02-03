package com.bonetobe.backend.cloth.infrastructure;

import com.bonetobe.backend.cloth.domain.Cloth;
import com.bonetobe.backend.common.SkeletonType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ClothRepository extends JpaRepository<Cloth, Long> {
    Optional<Cloth> findByBestSkeletonType(SkeletonType bestSkeletonType);

    Optional<Cloth> findByWorstSkeletonType(SkeletonType worstSkeletonType);
}
