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
public class ContactMessageResponse {
    private Long messageId;
    private String name;
    private String email;
    private String subject;
    private String message;
    private LocalDateTime createdAt;
}