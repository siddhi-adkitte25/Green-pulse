package com.environment.backend.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DonationRequest {
    private Double amount;
    private String message;
    private Long userId;
    private String paymentId;
    private String paymentStatus;
    
    public DonationRequest(Double amount, String message) {
        this.amount = amount;
        this.message = message;
    }
    
    public DonationRequest(Double amount, String message, String paymentId, String paymentStatus) {
        this.amount = amount;
        this.message = message;
        this.paymentId = paymentId;
        this.paymentStatus = paymentStatus;
    }
}