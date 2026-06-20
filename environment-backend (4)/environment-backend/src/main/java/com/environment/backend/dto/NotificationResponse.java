package com.environment.backend.dto;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponse {
    private Long notificationId;
    private String title;
    private String message;
    private String type;
    private Long eventId;
    private String eventTitle;
    private Long userId;
    private String userName;
    private Boolean isPublic;
    private LocalDateTime createdAt;
}