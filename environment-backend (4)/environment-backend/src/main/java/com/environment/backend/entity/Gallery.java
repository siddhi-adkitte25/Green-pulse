package com.environment.backend.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "gallery")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Gallery {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long imageId;
    
    @Column(nullable = false)
    private String imageUrl;
    
    private String caption;
    
    @CreationTimestamp
    private LocalDateTime uploadedAt;
    
    public Gallery(String imageUrl, String caption) {
        this.imageUrl = imageUrl;
        this.caption = caption;
    }
}