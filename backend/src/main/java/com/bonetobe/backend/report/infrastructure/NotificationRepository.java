package com.bonetobe.backend.report.infrastructure;

import com.bonetobe.backend.notification.domain.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    @Query("""
        select n
        from Notification n
        where n.user.id = :userId
            and n.isRead = false
        order by n.createdAt desc
    """)
    List<Notification> getNotificationsUnread(@Param("userId") Long userId);

    Optional<Notification> findByUuid(String uuid);
}
