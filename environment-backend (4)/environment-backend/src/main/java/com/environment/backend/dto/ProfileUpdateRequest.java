// src/main/java/com/environment/backend/dto/ProfileUpdateRequest.java
package com.environment.backend.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProfileUpdateRequest {
    
    @Pattern(
        regexp = "^[^\\s].*[^\\s]$", 
        message = "Name cannot start or end with spaces"
    )
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String name;
    
    @Pattern(
        regexp = "^[0-9]{10}$",
        message = "Mobile number must be 10 digits"
    )
    private String mobile;
}
