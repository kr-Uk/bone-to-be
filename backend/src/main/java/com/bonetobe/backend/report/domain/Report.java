package com.bonetobe.backend.report.domain;

import com.bonetobe.backend.common.BaseEntity;
import com.bonetobe.backend.user.domain.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class Report extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Embedded
    private Diagnosis diagnosis;

    @Column(name = "is_pending", nullable = false)
    private boolean pending = false;

    private String description;

    @Column(name = "is_representative", nullable = false)
    private boolean representative = false;

    public static Report startReport(User user) {
        Report report = new Report();
        report.user = user;
        return report;
    }
}
