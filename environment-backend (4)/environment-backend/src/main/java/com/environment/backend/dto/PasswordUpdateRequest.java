
// src/main/java/com/environment/backend/dto/PasswordUpdateRequest.java
package com.environment.backend.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PasswordUpdateRequest {
    
    @NotBlank(message = "Current password is required")
    private String currentPassword;
    
    @NotBlank(message = "New password is required")
    @Pattern(
        regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=\\S+$).{6,}$",
        message = "New password must be: at least 6 characters, contain at least one digit, one lowercase letter, one uppercase letter, and one special character"
    )
    private String newPassword;
}