// src/main/java/com/environment/backend/service/PaymentService.java
package com.environment.backend.service;

import org.json.JSONObject;
import org.springframework.stereotype.Service;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class PaymentService {

    // Hardcoded mock keys - no real Razorpay account needed
    private final String mockKeyId = "rzp_test_mock_" + UUID.randomUUID().toString().substring(0, 8);
    private final String mockKeySecret = "mock_secret_" + UUID.randomUUID().toString().substring(0, 8);

    public JSONObject createOrder(Double amount, String currency) {
        try {
            // Simulate some processing time
            Thread.sleep(1000);
            
            JSONObject orderResponse = new JSONObject();
            String orderId = "order_mock_" + System.currentTimeMillis();
            
            orderResponse.put("id", orderId);
            orderResponse.put("currency", currency != null ? currency : "INR");
            orderResponse.put("amount", amount * 100); // Convert to paise
            orderResponse.put("status", "created");
            orderResponse.put("receipt", "receipt_mock_" + System.currentTimeMillis());
            
            System.out.println("🎯 MOCK PAYMENT: Created order " + orderId + " for ₹" + amount);
            System.out.println("💡 Test Mode: No real payment will be processed");
            
            return orderResponse;
        } catch (Exception e) {
            throw new RuntimeException("Failed to create mock order: " + e.getMessage());
        }
    }

    public boolean verifyPayment(String orderId, String paymentId, String signature) {
        try {
            // Simulate verification processing
            Thread.sleep(500);
            
            // Mock verification - always return true for testing
            // In real scenario, this would verify with Razorpay
            boolean isValid = true;
            
            if (isValid) {
                System.out.println("✅ MOCK PAYMENT: Payment verified successfully");
                System.out.println("   Order ID: " + orderId);
                System.out.println("   Payment ID: " + paymentId);
                System.out.println("   Amount: Processed successfully");
            } else {
                System.out.println("❌ MOCK PAYMENT: Payment verification failed");
            }
            
            return isValid;
        } catch (Exception e) {
            System.err.println("MOCK PAYMENT: Verification error - " + e.getMessage());
            return false;
        }
    }

    // Get mock key ID for frontend
    public String getMockKeyId() {
        return mockKeyId;
    }
}