// src/main/java/com/environment/backend/controller/NotificationController.java
package com.environment.backend.controller;

import com.environment.backend.dto.NotificationRequest;
import com.environment.backend.dto.NotificationResponse;
import com.environment.backend.entity.User;
import com.environment.backend.service.NotificationService;
import com.environment.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {
    
    @Autowired
    private NotificationService notificationService;
    
    @Autowired
    private UserService userService;
    
    @PostMapping
    public ResponseEntity<?> createNotification(@RequestBody NotificationRequest request,
                                               Authentication authentication) {
        try {
            User currentUser = getCurrentUser(authentication);
            
            // Only admins can create notifications
            if (!currentUser.getRole().equals(com.environment.backend.entity.Role.ADMIN)) {
                return ResponseEntity.badRequest().body("Only admins can create notifications");
            }
            
            NotificationResponse notification = notificationService.createNotification(request);
            return ResponseEntity.ok(notification);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating notification: " + e.getMessage());
        }
    }
    
    @GetMapping("/public")
    public ResponseEntity<List<NotificationResponse>> getPublicNotifications() {
        List<NotificationResponse> notifications = notificationService.getPublicNotifications();
        return ResponseEntity.ok(notifications);
    }
    
    @GetMapping("/my-notifications")
    public ResponseEntity<List<NotificationResponse>> getMyNotifications(Authentication authentication) {
        User currentUser = getCurrentUser(authentication);
        List<NotificationResponse> notifications = notificationService.getUserRelevantNotifications(currentUser.getUserId());
        return ResponseEntity.ok(notifications);
    }
    
    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<NotificationResponse>> getEventNotifications(@PathVariable Long eventId) {
        List<NotificationResponse> notifications = notificationService.getEventNotifications(eventId);
        return ResponseEntity.ok(notifications);
    }
    
    @GetMapping("/type/{type}")
    public ResponseEntity<List<NotificationResponse>> getNotificationsByType(@PathVariable String type) {
        List<NotificationResponse> notifications = notificationService.getNotificationsByType(type);
        return ResponseEntity.ok(notifications);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteNotification(@PathVariable Long id, Authentication authentication) {
        try {
            User currentUser = getCurrentUser(authentication);
            
            // Only admins can delete notifications
            if (!currentUser.getRole().equals(com.environment.backend.entity.Role.ADMIN)) {
                return ResponseEntity.badRequest().body("Only admins can delete notifications");
            }
            
            notificationService.deleteNotification(id);
            return ResponseEntity.ok("Notification deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error deleting notification: " + e.getMessage());
        }
    }
    
    private User getCurrentUser(Authentication authentication) {
        String email = authentication.getName();
        return userService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}