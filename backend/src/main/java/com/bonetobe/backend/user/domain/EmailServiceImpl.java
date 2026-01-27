package com.bonetobe.backend.user.domain;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EmailServiceImpl implements EmailService {
    private final JavaMailSender mailSender;
    private final StringRedisTemplate redisTemplate;

    // 1. Redis 키 접두사 세분화 (충돌 방지 및 명확한 용도 구분)
    private static final String SIGNUP_PREFIX = "AUTH:SIGNUP:";          // 회원가입 코드 (Key: Email)
    private static final String RESET_CODE_PREFIX = "AUTH:RESET:CODE:";  // 비번 찾기 코드 (Key: Email)
    private static final String RESET_LINK_PREFIX = "AUTH:RESET:LINK:";  // 비번 찾기 링크 (Key: Token)
    private static final String VERIFIED_PREFIX = "AUTH:VERIFIED:";

    private static final Duration CODE_LIMIT_TIME = Duration.ofMinutes(5);
    private static final Duration LINK_LIMIT_TIME = Duration.ofMinutes(10);

    @Override
    @Transactional
    public void sendEmailCode(String email) {
        String authCode = createCode();
        sendEmail(email, "[BONETOBE] 회원가입 인증번호", "인증번호: " + authCode + "\n5분 이내에 입력해주세요.");

        saveToRedis(SIGNUP_PREFIX + email, authCode, CODE_LIMIT_TIME);
        log.info("[Redis 저장] Key: {}, Code: {}", SIGNUP_PREFIX + email.trim(), authCode);
    }

    @Override
    @Transactional
    public void sendPasswordResetLink(String email) {
        String token = UUID.randomUUID().toString();
        // TODO: 리셋 링크 짜자
        // String resetLink = "https://bonetobe.site/password-reset?token=" + token;
        String resetLink = "https://bonetobe.site"; //

        sendEmail(email, "[BONETOBE] 비밀번호 재설정 안내",
                "아래 링크를 클릭하여 비밀번호를 재설정하세요.\n" + resetLink);

        // 링크 방식: 토큰이 키가 되어야 나중에 이메일을 역추적할 수 있음
        saveToRedis(RESET_LINK_PREFIX + token, email, LINK_LIMIT_TIME);
        log.info("비밀번호 재설정 링크 발송 완료: email={}, token={}", email, token);
    }

    /**
     * [링크 방식 전용] 토큰으로 이메일 조회 및 검증
     */
    @Override
    public String getEmailByResetToken(String token) {
        String key = RESET_LINK_PREFIX + token;
        String email = redisTemplate.opsForValue().get(key);

        if (email == null) {
            // ErrorCode.BAD_REQUEST 등을 활용해 예외 처리
            throw new RuntimeException("유효하지 않거나 만료된 링크입니다.");
        }

        redisTemplate.delete(key); // 일회용성이므로 사용 후 즉시 삭제
        return email;
    }

    @Override
    public boolean verifyCode(String email, String code) {
        // [1] 메서드 진입 확인 로그
        log.info(">>>> [EmailService.verifyCode 진입] 이메일: {}, 입력코드: {}", email, code);

        if (email == null || code == null) {
            log.warn("!!!! [EmailService] 이메일 또는 코드가 null입니다.");
            return false;
        }

        String cleanEmail = email.trim();
        String cleanCode = code.trim();

        // [2] 회원가입 코드 확인 (순서 변경 및 로그 상세화)
        boolean isSignupValid = checkAndDelete(SIGNUP_PREFIX + cleanEmail, cleanCode);
        if (isSignupValid) {
            log.info(">>>> [EmailService] 회원가입 인증 성공!");
            return true;
        }

        // [3] 비밀번호 재설정 코드 확인
        boolean isResetValid = checkAndDelete(RESET_CODE_PREFIX + cleanEmail, cleanCode);
        if (isResetValid) {
            log.info(">>>> [EmailService] 비밀번호 재설정 인증 성공!");
            return true;
        }

        log.warn(">>>> [EmailService] 모든 인증 키 조회 실패: {}", cleanEmail);
        return false;
    }

    public boolean isEmailVerified(String email) {
        return Boolean.TRUE.toString().equals(redisTemplate.opsForValue().get(VERIFIED_PREFIX + email));
    }

    // --- 내부 헬퍼 메서드 (중복 제거 및 가독성 향상) ---

    private void saveToRedis(String key, String value, Duration timeout) {
        redisTemplate.opsForValue().set(key, value, timeout);
    }

    private boolean checkAndDelete(String key, String code) {
        // [4] Redis 조회 시도 로그
        log.info(">>>> [Redis 조회 시도] Key: {}", key);

        String savedCode = redisTemplate.opsForValue().get(key);
        log.info(">>>> [Redis 조회 결과] Key: {}, 저장된코드: {}, 입력코드: {}", key, savedCode, code);

        if (savedCode != null && savedCode.equals(code)) {
            redisTemplate.delete(key);
            log.info(">>>> [Redis 데이터 삭제 완료] Key: {}", key);
            return true;
        }
        return false;
    }

    private String createCode() {
        return String.valueOf((int)(Math.random() * 899999) + 100000);
    }

    // SimpleMailMessage 대신 MimeMessage를 사용하도록 변경
    private void sendEmail(String to, String subject, String text) {
        MimeMessage message = mailSender.createMimeMessage(); //

        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8"); //
            helper.setTo(to);
            helper.setSubject(subject);

            // 텍스트에 포함된 URL을 클릭 가능한 링크로 변환하는 간단한 처리
            // 만약 단순 6자리 코드라면 일반 텍스트로 보이고, URL이 포함되면 클릭 가능해집니다.
            String content = text.replace("\n", "<br>"); // 줄바꿈 처리
            if (text.contains("http")) {
                // URL이 포함된 경우 <a> 태그로 감싸 클릭 가능하게 만듭니다.
                content = content.replace("https://", "<a href='https://")
                        .replace("http://", "<a href='http://")
                        .concat("'>링크 클릭하기</a>");
            }

            helper.setText(content, true); // true 설정 시 HTML로 발송됨
            mailSender.send(message);
        } catch (Exception e) {
            log.error("메일 발송 실패: target={}, error={}", to, e.getMessage());
            throw new RuntimeException("이메일 발송 중 오류가 발생했습니다.");
        }
    }
}