package com.bonetobe.backend.auth.application;

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
public class EmailServiceImpl implements EmailService{
    private final JavaMailSender mailSender;
    private final StringRedisTemplate redisTemplate;

    @Override
    @Transactional // 쓰기 작업이 있으므로 별도 선언 (RDB 작업이 없어도 습관화하는 것이 좋음)
    public void sendEmailCode(String email) {
        String authCode = String.valueOf((int)(Math.random() * 899999) + 100000); // 6자리 난수

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("[BONETOBE] 회원가입 인증번호입니다.");
        message.setText("인증번호: " + authCode + "\n5분 이내에 입력해주세요.");

        try {
            mailSender.send(message);
            // Redis에 'AUTH:이메일' 키로 5분간 저장
            redisTemplate.opsForValue().set("AUTH:" + email, authCode, Duration.ofMinutes(5));
            log.info("인증코드 발송 완료: {}", email);
        } catch (Exception e) {
            throw new RuntimeException("이메일 발송에 실패했습니다.");
        }
    }

    @Override
    public boolean verifyCode(String email, String code) {
        String savedCode = redisTemplate.opsForValue().get("AUTH:" + email);
        return code.equals(savedCode);
    }
}
