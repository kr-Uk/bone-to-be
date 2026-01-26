package com.bonetobe.backend.user.infrastructure;

import com.bonetobe.backend.user.domain.User;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // 1. 이미 관리자 계정이 있는지 확인 (중복 생성 방지)
        String adminEmail = "admin@example.com";

        if (userRepository.findByEmail(adminEmail).isEmpty()) {
            // 2. 관리자 계정 생성 (비밀번호 암호화)
            String encodedPassword = passwordEncoder.encode("Admin1234!");

            User admin = User.createUser(
                    adminEmail,
                    encodedPassword,
                    "관리자",
                    "ADMIN"
            );

            // 3. DB 저장
            userRepository.save(admin);
            System.out.println("초기 관리자 계정이 생성되었습니다: " + adminEmail);
        }
    }
}
