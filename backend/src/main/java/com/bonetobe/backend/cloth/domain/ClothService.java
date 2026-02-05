package com.bonetobe.backend.cloth.domain;

import com.bonetobe.backend.common.SkeletonType;
import com.bonetobe.backend.style.domain.StyleName;
import com.bonetobe.backend.user.domain.Gender;

public interface ClothService {
    BestWorstClothDownload getClothByStyleAndGender(SkeletonType skeletonType, StyleName styleName, Gender gender);
}
