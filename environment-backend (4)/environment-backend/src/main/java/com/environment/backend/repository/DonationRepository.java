// src/main/java/com/environment/backend/repository/DonationRepository.java
package com.environment.backend.repository;

import com.environment.backend.entity.Donation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface DonationRepository extends JpaRepository<Donation, Long> {
    List<Donation> findByOrderByDonatedAtDesc();
    
    List<Donation> findByUserUserIdOrderByDonatedAtDesc(Long userId);
    
    List<Donation> findByPaymentStatusOrderByDonatedAtDesc(String paymentStatus);
    
    @Query("SELECT SUM(d.amount) FROM Donation d WHERE d.paymentStatus = 'SUCCESS'")
    Double getTotalDonationsAmount();
    
    @Query("SELECT SUM(d.amount) FROM Donation d WHERE d.paymentStatus = 'SUCCESS' AND d.user.userId = :userId")
    Double getTotalUserDonationsAmount(Long userId);
}