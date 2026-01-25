package com.bonetobe.backend.user.domain;

import com.bonetobe.backend.common.BaseEntity;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "users")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
// delete 호출 시 실제 삭제 대신 UPDATE 쿼리 실행
@SQLDelete(sql = "UPDATE users SET is_deleted = true, deleted_at = NOW() WHERE id = ?")
// 별도 설정이 없으면 조회 시 삭제되지 않은 데이터만 가져옴
@Where(clause = "is_deleted = false")
public class User extends BaseEntity implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(
            mappedBy = "user",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY
    )
    private Profile profile;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String nickname;

    @Column(nullable = false)
    private String role; // "USER" 또는 "ADMIN"

    @Column(name = "is_deleted", nullable = false, columnDefinition = "boolean default false")
    private Boolean isDeleted = false;

    private LocalDateTime deletedAt;   // 삭제 시간

    // 관리자 기능이나 특수 상황을 위해 삭제 상태 확인 메서드
    public boolean isDeleted() {
        return this.isDeleted;
    }

    // 정적 팩토리 메서드 도입
    public static User createUser(String email, String password, String nickname, String role) {
        User user = new User();
        user.email = email;
        user.password = password;
        user.nickname = nickname;
        user.role = (role == null) ? "USER" : role; // 권한이 입력되지 않으면 기본값 "USER"
        return user;
    }

    public void updatePassword(String encodedPassword) {
        this.password = encodedPassword;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + this.role));
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
