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
public class EventResponse {
    private Long eventId;
    private String title;
    private String description;
    private LocalDateTime date;
    private String venue;
    private String createdByName;
    private LocalDateTime createdAt;
}