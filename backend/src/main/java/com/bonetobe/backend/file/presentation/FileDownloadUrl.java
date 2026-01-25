package com.bonetobe.backend.file.presentation;

public class FileDownloadUrl {
    public record Query(Long fileId) {

    }

    public record Result(Long fileId, Long ownerId, String presignedUrl) {

    }
}
