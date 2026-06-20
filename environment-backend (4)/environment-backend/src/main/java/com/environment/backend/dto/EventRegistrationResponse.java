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
public class EventRegistrationResponse {
    private Long regId;
    private Long eventId;
    private String eventTitle;
    private LocalDateTime eventDate;
    private String eventVenue;
    private String userName;
    private String userEmail;
    private LocalDateTime registeredAt;
}