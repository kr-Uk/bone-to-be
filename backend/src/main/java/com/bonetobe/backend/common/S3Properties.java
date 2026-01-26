package com.bonetobe.backend.common;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.bind.ConstructorBinding;

@ConfigurationProperties(prefix = "s3")
public record S3Properties(String region, String bucket) {

}
