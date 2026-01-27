package com.bonetobe.backend.file.presentation;

import io.swagger.v3.oas.annotations.media.Schema;

public class FileDownloadUrl {
    @Schema(name = "FileDownloadUrlQuery")
    public record Query(Long fileId) {

    }

    @Schema(name = "FileDownloadUrlResult")
    public record Result(Long fileId, Long ownerId, String presignedUrl) {

    }
}
