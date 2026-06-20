package com.environment.backend.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
public class VerifyPaymentRequest {
    private String orderId;
    private String paymentId;
    private String signature;
}