package com.environment.backend.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
public class NotificationRequest {
    private String title;
    private String message;
    private String type;
    private Long eventId;
    private Long userId;
    private Boolean isPublic;
}