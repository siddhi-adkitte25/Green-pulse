package com.environment.backend.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "donations")
@Getter
@Setter
@NoArgsConstructor
public class Donation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long donationId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
    
    @Column(nullable = false)
    private Double amount;
    
    @Column(columnDefinition = "TEXT")
    private String message;
    
    @Column(name = "payment_id")
    private String paymentId;
    
    @Column(name = "payment_status")
    private String paymentStatus = "SUCCESS";
    
    @CreationTimestamp
    private LocalDateTime donatedAt;
    
    public Donation(User user, Double amount, String message) {
        this.user = user;
        this.amount = amount;
        this.message = message;
    }
    
    public Donation(User user, Double amount, String message, String paymentId, String paymentStatus) {
        this.user = user;
        this.amount = amount;
        this.message = message;
        this.paymentId = paymentId;
        this.paymentStatus = paymentStatus;
    }
}