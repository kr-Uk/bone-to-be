package com.bonetobe.backend.cloth.domain;

public record BestWorstClothDownload(
    Long bestClothId,
    String bestClothUrl,
    Long worstClothId,
    String worstClothUrl
) {
}
