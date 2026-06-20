// src/main/java/com/environment/backend/repository/NotificationRepository.java
package com.environment.backend.repository;

import com.environment.backend.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    
    // Find public notifications
    List<Notification> findByIsPublicTrueOrderByCreatedAtDesc();
    
    // Find notifications for a specific user
    List<Notification> findByUserUserIdOrderByCreatedAtDesc(Long userId);
    
    // Find notifications for an event
    List<Notification> findByEventEventIdOrderByCreatedAtDesc(Long eventId);
    
    // Find notifications by type
    List<Notification> findByTypeOrderByCreatedAtDesc(com.environment.backend.entity.NotificationType type);
    
    // Find notifications for a user (both public and personal)
    @Query("SELECT n FROM Notification n WHERE n.isPublic = true OR n.user.userId = :userId ORDER BY n.createdAt DESC")
    List<Notification> findRelevantNotificationsForUser(Long userId);
}