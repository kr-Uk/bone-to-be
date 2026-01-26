package com.bonetobe.backend.file.domain;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import java.util.Arrays;
import java.util.Map;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Getter
public enum ContentType {
    IMAGE_JPEG("image/jpeg", "jpg"),
    IMAGE_PNG("image/png", "png"),
    IMAGE_WEBP("image/webp", "webp");

    private final String contentType;
    private final String Extension;

    private static final Map<String, ContentType> CONTENT_TYPE_MAP =
        Arrays.stream(values())
            .collect(Collectors.toUnmodifiableMap(
                ct -> ct.contentType,
                ct -> ct
            ));

    // content type 유효 여부 판단
    public static boolean isValidContentType(String contentType) {
        return CONTENT_TYPE_MAP.containsKey(contentType);
    }

    public static ContentType getContentType(String contentType) {
        if(!isValidContentType(contentType)) {
            /*
                TODO : business exception 합쳐지면 리팩토링
             */
            throw new FileMetaDataInputException();
        }

        return CONTENT_TYPE_MAP.get(contentType);
    }
}
