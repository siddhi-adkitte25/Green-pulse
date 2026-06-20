// src/main/java/com/environment/backend/entity/User.java
package com.environment.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;
    
    @NotBlank(message = "Name is required")
    @Pattern(regexp = "^[^\\s].*[^\\s]$", message = "Name cannot start or end with spaces")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    @Column(nullable = false)
    private String name;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Pattern(
        regexp = "^[A-Za-z0-9+_.-]+@(.+)$",
        message = "Invalid email format"
    )
    @Column(nullable = false, unique = true)
    private String email;
    
    @NotBlank(message = "Password is required")
    @Pattern(
        regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=\\S+$).{6,}$",
        message = "Password must be at least 6 characters, contain at least one digit, one lowercase, one uppercase, and one special character"
    )
    @Column(nullable = false)
    private String password;
    
    @Enumerated(EnumType.STRING)
    @NotNull(message = "Role is required")
    @Column(nullable = false)
    private Role role;
    
    @Pattern(
        regexp = "^[0-9]{10}$",
        message = "Mobile number must be 10 digits"
    )
    @Column(nullable = false)
    private String mobile;
    
    @CreationTimestamp
    private LocalDateTime createdAt;

    // Custom constructor without ID for creating new users
    public User(String name, String email, String password, Role role, String mobile) {
        this.name = name.trim();
        this.email = email.trim().toLowerCase();
        this.password = password;
        this.role = role;
        this.mobile = mobile;
    }
}