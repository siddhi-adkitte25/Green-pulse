// src/main/java/com/environment/backend/service/NotificationService.java
package com.environment.backend.service;

import com.environment.backend.dto.NotificationRequest;
import com.environment.backend.dto.NotificationResponse;
import com.environment.backend.entity.*;
import com.environment.backend.repository.NotificationRepository;
import com.environment.backend.repository.EventRepository;
import com.environment.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {
    
    @Autowired
    private NotificationRepository notificationRepository;
    
    @Autowired
    private EventRepository eventRepository;
    
    @Autowired
    private UserRepository userRepository; // This should be your existing UserRepository
    
    public NotificationResponse createNotification(NotificationRequest request) {
        Notification notification = new Notification();
        notification.setTitle(request.getTitle());
        notification.setMessage(request.getMessage());
        notification.setType(NotificationType.valueOf(request.getType().toUpperCase()));
        notification.setIsPublic(request.getIsPublic());
        
        // Set event if provided
        if (request.getEventId() != null) {
            Event event = eventRepository.findById(request.getEventId())
                    .orElseThrow(() -> new RuntimeException("Event not found"));
            notification.setEvent(event);
        }
        
        // Set user if provided (for personal notifications)
        if (request.getUserId() != null) {
            User user = userRepository.findById(request.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            notification.setUser(user);
        }
        
        Notification savedNotification = notificationRepository.save(notification);
        return convertToResponse(savedNotification);
    }
    
    public List<NotificationResponse> getPublicNotifications() {
        List<Notification> notifications = notificationRepository.findByIsPublicTrueOrderByCreatedAtDesc();
        return notifications.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public List<NotificationResponse> getUserRelevantNotifications(Long userId) {
        List<Notification> notifications = notificationRepository.findRelevantNotificationsForUser(userId);
        return notifications.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public List<NotificationResponse> getEventNotifications(Long eventId) {
        List<Notification> notifications = notificationRepository.findByEventEventIdOrderByCreatedAtDesc(eventId);
        return notifications.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public List<NotificationResponse> getNotificationsByType(String type) {
        NotificationType notificationType = NotificationType.valueOf(type.toUpperCase());
        List<Notification> notifications = notificationRepository.findByTypeOrderByCreatedAtDesc(notificationType);
        return notifications.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public void deleteNotification(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notificationRepository.delete(notification);
    }
    
    private NotificationResponse convertToResponse(Notification notification) {
        return new NotificationResponse(
            notification.getNotificationId(),
            notification.getTitle(),
            notification.getMessage(),
            notification.getType().name(),
            notification.getEvent() != null ? notification.getEvent().getEventId() : null,
            notification.getEvent() != null ? notification.getEvent().getTitle() : null,
            notification.getUser() != null ? notification.getUser().getUserId() : null,
            notification.getUser() != null ? notification.getUser().getName() : null,
            notification.getIsPublic(),
            notification.getCreatedAt()
        );
    }
}