package com.environment.backend.dto;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
public class EventRequest {
    private String title;
    private String description;
    private LocalDateTime date;
    private String venue;
}