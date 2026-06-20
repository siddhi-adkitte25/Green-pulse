// src/main/java/com/environment/backend/controller/DonationController.java
package com.environment.backend.controller;

import com.environment.backend.dto.DonationRequest;
import com.environment.backend.dto.DonationResponse;
import com.environment.backend.entity.User;
import com.environment.backend.service.DonationService;
import com.environment.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/donations")
@CrossOrigin(origins = "*")
public class DonationController {
    
    @Autowired
    private DonationService donationService;
    
    @Autowired
    private UserService userService;
    
    @PostMapping
    public ResponseEntity<?> makeDonation(@RequestBody DonationRequest request,
                                         Authentication authentication) {
        try {
            // If user is authenticated, use their ID
            if (authentication != null && authentication.isAuthenticated()) {
                User currentUser = getCurrentUser(authentication);
                request.setUserId(currentUser.getUserId());
            }
            
            // Set default payment status if not provided
            if (request.getPaymentStatus() == null) {
                request.setPaymentStatus("SUCCESS");
            }
            
            DonationResponse donation = donationService.makeDonation(request);
            return ResponseEntity.ok(donation);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error making donation: " + e.getMessage());
        }
    }
    
    @GetMapping
    public ResponseEntity<List<DonationResponse>> getAllDonations() {
        List<DonationResponse> donations = donationService.getAllDonations();
        return ResponseEntity.ok(donations);
    }
    
    @GetMapping("/my-donations")
    public ResponseEntity<List<DonationResponse>> getMyDonations(Authentication authentication) {
        User currentUser = getCurrentUser(authentication);
        List<DonationResponse> donations = donationService.getUserDonations(currentUser.getUserId());
        return ResponseEntity.ok(donations);
    }
    
    @GetMapping("/total")
    public ResponseEntity<Double> getTotalDonations() {
        Double total = donationService.getTotalDonations();
        return ResponseEntity.ok(total);
    }
    
    @GetMapping("/status/{paymentStatus}")
    public ResponseEntity<List<DonationResponse>> getDonationsByPaymentStatus(@PathVariable String paymentStatus) {
        List<DonationResponse> donations = donationService.getDonationsByPaymentStatus(paymentStatus);
        return ResponseEntity.ok(donations);
    }
    
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updatePaymentStatus(@PathVariable Long id, 
                                                @RequestParam String paymentStatus,
                                                Authentication authentication) {
        try {
            User currentUser = getCurrentUser(authentication);
            
            // Only admins can update payment status
            if (!currentUser.getRole().equals(com.environment.backend.entity.Role.ADMIN)) {
                return ResponseEntity.badRequest().body("Only admins can update payment status");
            }
            
            DonationResponse donation = donationService.updatePaymentStatus(id, paymentStatus);
            return ResponseEntity.ok(donation);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating payment status: " + e.getMessage());
        }
    }
    
    private User getCurrentUser(Authentication authentication) {
        String email = authentication.getName();
        return userService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}