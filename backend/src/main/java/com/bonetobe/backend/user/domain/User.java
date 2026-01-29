package com.bonetobe.backend.user.domain;

import com.bonetobe.backend.common.BaseEntity;
import com.bonetobe.backend.common.SkeletonType;
import com.bonetobe.backend.file.domain.StoredFile;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class User extends BaseEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String nickname;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role;

    @Column(nullable = false)
    private Boolean isDeleted = false;

    @Column
    private SkeletonType skeletonType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "file_id")
    private StoredFile profileImage;

    // 정적 팩토리 메서드 도입
    public static User createUser(String email, String password, String nickname, UserRole role) {
        User user = new User();
        user.email = email;
        user.password = password;
        user.nickname = nickname;
        user.role = (role == null) ? UserRole.USER : role;
        return user;
    }

    public static User of(Long userId) {
        User user = new User();
        user.id = userId;
        return user;
    }

    //
    public void updateProfile(String nickname, StoredFile profileImage) {
        this.nickname = nickname;
        this.profileImage = profileImage;
    }

    // 비밀번호 업데이트
    public void updatePassword(String encodedPassword) {
        this.password = encodedPassword;
    }

    // 계정 삭제
    public void deleteUser() {
        if (!isDeleted) {
            isDeleted = true;
        }
    }

    public User update(String name) {
        this.nickname = name;
        return this;
    }
}
