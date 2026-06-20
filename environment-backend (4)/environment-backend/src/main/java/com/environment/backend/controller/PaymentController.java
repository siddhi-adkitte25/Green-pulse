// src/main/java/com/environment/backend/controller/PaymentController.java
package com.environment.backend.controller;

import com.environment.backend.dto.*;
import com.environment.backend.service.PaymentService;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody CreateOrderRequest request) {
        try {
            System.out.println("💰 MOCK: Creating payment order for ₹" + request.getAmount());
            
            if (request.getAmount() == null || request.getAmount() <= 0) {
                return ResponseEntity.badRequest().body("Invalid amount: " + request.getAmount());
            }
            
            if (request.getAmount() < 1) {
                return ResponseEntity.badRequest().body("Minimum amount is ₹1");
            }
            
            // Add some realistic validation
            if (request.getAmount() > 100000) {
                return ResponseEntity.badRequest().body("Maximum donation amount is ₹100,000");
            }
            
            var order = paymentService.createOrder(request.getAmount(), 
                request.getCurrency() != null ? request.getCurrency() : "INR");
            
            CreateOrderResponse response = new CreateOrderResponse(
                order.getString("id"),
                order.getString("currency"),
                request.getAmount(),
                paymentService.getMockKeyId() // Use mock key
            );
            
            System.out.println("✅ MOCK: Order created successfully: " + order.getString("id"));
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("❌ MOCK: Error creating order: " + e.getMessage());
            
            // Simulate occasional failures for realism
            if (Math.random() < 0.1) { // 10% chance of random failure
                return ResponseEntity.badRequest().body("Temporary payment gateway issue. Please try again.");
            }
            
            return ResponseEntity.badRequest().body("Payment service error: " + e.getMessage());
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(@RequestBody VerifyPaymentRequest request) {
        try {
            System.out.println("🔍 MOCK: Verifying payment: " + request.getPaymentId());
            
            if (request.getOrderId() == null || request.getPaymentId() == null || request.getSignature() == null) {
                return ResponseEntity.badRequest().body("Missing payment verification data");
            }
            
            boolean isValid = paymentService.verifyPayment(
                request.getOrderId(), 
                request.getPaymentId(), 
                request.getSignature()
            );
            
            if (isValid) {
                System.out.println("✅ MOCK: Payment verified successfully: " + request.getPaymentId());
                
                // Return success response with mock transaction details
                JSONObject successResponse = new JSONObject();
                successResponse.put("status", "success");
                successResponse.put("message", "Payment verified successfully");
                successResponse.put("transactionId", request.getPaymentId());
                successResponse.put("amount", "Processed");
                successResponse.put("mode", "TEST");
                
                return ResponseEntity.ok(successResponse.toString());
            } else {
                System.out.println("❌ MOCK: Payment verification failed: " + request.getPaymentId());
                return ResponseEntity.badRequest().body("Payment verification failed");
            }
        } catch (Exception e) {
            System.err.println("❌ MOCK: Verification error: " + e.getMessage());
            return ResponseEntity.badRequest().body("Verification error: " + e.getMessage());
        }
    }

    // Additional endpoint to simulate payment status
    @GetMapping("/test-info")
    public ResponseEntity<?> getTestInfo() {
        JSONObject info = new JSONObject();
        info.put("mode", "MOCK_PAYMENT");
        info.put("status", "ACTIVE");
        info.put("message", "Using hardcoded mock payment system");
        info.put("test_card", "4111 1111 1111 1111");
        info.put("test_cvv", "Any 3 digits");
        info.put("test_expiry", "Any future date");
        
        return ResponseEntity.ok(info.toString());
    }
}