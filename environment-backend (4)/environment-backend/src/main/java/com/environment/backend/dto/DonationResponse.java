package com.environment.backend.dto;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class DonationResponse {
    private Long donationId;
    private Long userId;
    private String userName;
    private Boolean isAnonymous;
    private Double amount;
    private String message;
    private String paymentId;
    private String paymentStatus;
    private LocalDateTime donatedAt;
    
    public DonationResponse(Long donationId, Long userId, String userName, 
                           Boolean isAnonymous, Double amount, String message, 
                           LocalDateTime donatedAt) {
        this(donationId, userId, userName, isAnonymous, amount, message, null, "SUCCESS", donatedAt);
    }
}