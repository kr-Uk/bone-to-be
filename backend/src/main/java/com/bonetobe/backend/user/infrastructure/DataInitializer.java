package com.bonetobe.backend.user.infrastructure;

import com.bonetobe.backend.user.domain.User;
import com.bonetobe.backend.user.domain.UserRepository;
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
        String adminEmail = "admin@example.com";

        // findByEmail 대신, 삭제된 계정까지 다 찾아보는 findAnyByEmail 사용
        if (userRepository.findAnyByEmail(adminEmail).isEmpty()) {
            String encodedPassword = passwordEncoder.encode("Admin1234!");

            User admin = User.createUser(
                    adminEmail,
                    encodedPassword,
                    "관리자",
                    "ADMIN"
            );

            userRepository.save(admin);
            System.out.println("초기 관리자 계정이 생성되었습니다: " + adminEmail);
        } else {
            System.out.println("관리자 계정이 이미 존재합니다 (탈퇴 상태 포함).");
        }
    }
}
