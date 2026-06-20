// src/main/java/com/environment/backend/service/DonationService.java
package com.environment.backend.service;

import com.environment.backend.dto.DonationRequest;
import com.environment.backend.dto.DonationResponse;
import com.environment.backend.entity.Donation;
import com.environment.backend.entity.User;
import com.environment.backend.repository.DonationRepository;
import com.environment.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DonationService {
    
    @Autowired
    private DonationRepository donationRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public DonationResponse makeDonation(DonationRequest request) {
        Donation donation = new Donation();
        donation.setAmount(request.getAmount());
        donation.setMessage(request.getMessage());
        donation.setPaymentId(request.getPaymentId());
        donation.setPaymentStatus(request.getPaymentStatus() != null ? request.getPaymentStatus() : "SUCCESS");
        
        // Set user if provided (not anonymous)
        if (request.getUserId() != null) {
            User user = userRepository.findById(request.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            donation.setUser(user);
        }
        
        Donation savedDonation = donationRepository.save(donation);
        return convertToResponse(savedDonation);
    }
    
    public List<DonationResponse> getAllDonations() {
        List<Donation> donations = donationRepository.findByOrderByDonatedAtDesc();
        return donations.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public List<DonationResponse> getUserDonations(Long userId) {
        List<Donation> donations = donationRepository.findByUserUserIdOrderByDonatedAtDesc(userId);
        return donations.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public Double getTotalDonations() {
        return donationRepository.getTotalDonationsAmount();
    }
    
    public List<DonationResponse> getDonationsByPaymentStatus(String paymentStatus) {
        List<Donation> donations = donationRepository.findByPaymentStatusOrderByDonatedAtDesc(paymentStatus);
        return donations.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public DonationResponse updatePaymentStatus(Long donationId, String paymentStatus) {
        Donation donation = donationRepository.findById(donationId)
                .orElseThrow(() -> new RuntimeException("Donation not found"));
        donation.setPaymentStatus(paymentStatus);
        Donation updatedDonation = donationRepository.save(donation);
        return convertToResponse(updatedDonation);
    }
    
    private DonationResponse convertToResponse(Donation donation) {
        Boolean isAnonymous = donation.getUser() == null;
        Long userId = isAnonymous ? null : donation.getUser().getUserId();
        String userName = isAnonymous ? "Anonymous" : donation.getUser().getName();
        
        return new DonationResponse(
            donation.getDonationId(),
            userId,
            userName,
            isAnonymous,
            donation.getAmount(),
            donation.getMessage(),
            donation.getPaymentId(),
            donation.getPaymentStatus(),
            donation.getDonatedAt()
        );
    }
}