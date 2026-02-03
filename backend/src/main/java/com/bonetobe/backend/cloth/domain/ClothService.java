package com.bonetobe.backend.cloth.domain;

import com.bonetobe.backend.common.SkeletonType;

public interface ClothService {
    BestWorstClothDownload getClothDownloadPresignedUrls(SkeletonType skeletonType);
}
