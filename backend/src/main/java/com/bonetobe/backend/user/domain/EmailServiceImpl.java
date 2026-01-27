package com.bonetobe.backend.user.domain;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EmailServiceImpl implements EmailService {
    private final JavaMailSender mailSender;
    private final StringRedisTemplate redisTemplate;

    // Redis 키 접두사 관리
    private static final String SIGNUP_PREFIX = "AUTH:";
    private static final String RESET_PREFIX = "AUTH:EMAIL:RESET:";
    private static final Duration LIMIT_TIME = Duration.ofMinutes(5);

    @Override
    @Transactional
    public void sendEmailCode(String email) {
        String authCode = createCode();
        sendEmail(email, "[BONETOBE] 회원가입 인증번호입니다.", "인증번호: " + authCode + "\n5분 이내에 입력해주세요.");

        // 회원가입용 키로 저장
        redisTemplate.opsForValue().set(SIGNUP_PREFIX + email, authCode, LIMIT_TIME);
        log.info("회원가입 인증코드 발송 완료: {}", email);
    }

    @Override
    @Transactional
    public void sendPasswordResetCode(String email) {
        String authCode = createCode();
        sendEmail(email, "[BONETOBE] 비밀번호 재설정 인증 코드입니다.", "인증번호: " + authCode + "\n5분 이내에 입력해주세요.");

        // 비밀번호 재설정 전용 키로 저장
        redisTemplate.opsForValue().set(RESET_PREFIX + email, authCode, LIMIT_TIME);
        log.info("비밀번호 재설정 코드 발송 완료: {}", email);
    }

    @Override
    public boolean verifyCode(String email, String code) {
        // 1. 먼저 비밀번호 재설정용 코드가 있는지 확인
        String resetCode = redisTemplate.opsForValue().get(RESET_PREFIX + email);
        if (code.equals(resetCode)) {
            redisTemplate.delete(RESET_PREFIX + email); // 사용 후 즉시 삭제 (보안)
            return true;
        }

        // 2. 없으면 회원가입용 코드 확인
        String signupCode = redisTemplate.opsForValue().get(SIGNUP_PREFIX + email);
        if (code.equals(signupCode)) {
            redisTemplate.delete(SIGNUP_PREFIX + email); // 사용 후 즉시 삭제
            return true;
        }

        return false;
    }

    // --- 내부 헬퍼 메서드 ---

    private String createCode() {
        return String.valueOf((int)(Math.random() * 899999) + 100000);
    }

    private void sendEmail(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);

        try {
            mailSender.send(message);
        } catch (Exception e) {
            log.error("메일 발송 실패: {}", to, e);
            throw new RuntimeException("이메일 발송에 실패했습니다.");
        }
    }
}
