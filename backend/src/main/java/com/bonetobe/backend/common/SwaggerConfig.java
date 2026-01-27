package com.bonetobe.backend.common;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {
    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("BONETOBE API 명세서")
                        .description("SSAFYcial 14기 프로젝트 BONETOBE의 백엔드 API 문서입니다.")
                        .version("v1.0.0"));
    }
}
