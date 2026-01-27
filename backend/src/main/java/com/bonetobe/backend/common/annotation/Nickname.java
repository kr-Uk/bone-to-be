package com.bonetobe.backend.common.annotation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.lang.annotation.*;

@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = {})
@Size(max = 10, message = "닉네임은 10자 이하로 입력해주세요.")
@Pattern(
        regexp = "^[a-zA-Z0-9가-힣]*$",
        message = "닉네임은 한글, 영문, 숫자만 가능하며 공백이나 특수문자, 자음/모음은 사용할 수 없습니다."
)
@Documented
public @interface Nickname {
    String message() default "닉네임 형식이 올바르지 않습니다.";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}