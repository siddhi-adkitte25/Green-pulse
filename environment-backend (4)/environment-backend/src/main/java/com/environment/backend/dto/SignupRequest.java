package com.environment.backend.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SignupRequest {
    
    @NotBlank(message = "Name is required")
    @Pattern(
        regexp = "^[^\\s].*[^\\s]$", 
        message = "Name cannot start or end with spaces"
    )
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String name;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Pattern(
        regexp = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$",
        message = "Invalid email format"
    )
    private String email;
    
    @NotBlank(message = "Password is required")
    @Pattern(
        regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=\\S+$).{6,}$",
        message = "Password must be: at least 6 characters, contain at least one digit, one lowercase letter, one uppercase letter, and one special character"
    )
    private String password;
    
    @NotBlank(message = "Mobile number is required")
    @Pattern(
        regexp = "^[0-9]{10}$",
        message = "Mobile number must be exactly 10 digits"
    )
    private String mobile;
    
    @NotBlank(message = "Role is required")
    @Pattern(
        regexp = "^(ADMIN|USER)$",
        message = "Role must be either ADMIN or USER"
    )
    private String role;
}