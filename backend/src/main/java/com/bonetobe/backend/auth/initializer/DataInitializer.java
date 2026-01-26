package com.bonetobe.backend.auth.initializer;

import com.bonetobe.backend.user.domain.User;
import com.bonetobe.backend.user.domain.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * DataInitializer: 애플리케이션 기동 시점에 실행되어 필요한 초기 데이터를 DB에 세팅하는 클래스
 * CommandLineRunner를 구현하여 서버가 켜진 직후 run() 메서드가 자동으로 실행됩니다.
 */
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // yml의 init.admin.email 값을 가져옵니다.
    @Value("${init.admin.email}")
    private String adminEmail;

    // yml의 init.admin.password 값을 가져옵니다.
    @Value("${init.admin.password}")
    private String adminPassword;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.findByEmail(adminEmail).isEmpty()) {
            // 하드코딩 대신 설정파일에서 읽어온 비밀번호 암호화
            String encodedPassword = passwordEncoder.encode(adminPassword);

            User admin = User.createUser(
                    adminEmail,
                    encodedPassword,
                    "관리자",
                    "ADMIN"
            );

            userRepository.save(admin);
            System.out.println("초기 관리자 계정이 생성되었습니다: " + adminEmail);
        }
    }
}