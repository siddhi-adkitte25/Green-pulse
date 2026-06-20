package com.environment.backend.controller;

import com.environment.backend.dto.*;
import com.environment.backend.entity.User;
import com.environment.backend.entity.Role;
import com.environment.backend.service.UserService;
import com.environment.backend.util.JwtUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AuthController {
    
    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final JwtUtil jwtUtil;
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            String email = loginRequest.getEmail().trim().toLowerCase();
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, loginRequest.getPassword())
            );
            
            User user = userService.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            String token = jwtUtil.generateToken(email);
            return ResponseEntity.ok(new LoginResponse(token, user.getEmail(), user.getName(), user.getRole().name(), user.getUserId()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid credentials");
        }
    }
    
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest signupRequest) {
        try {
            String email = signupRequest.getEmail().trim().toLowerCase();
            
            if (userService.existsByEmail(email)) {
                return ResponseEntity.badRequest().body("Email already exists");
            }
            
            Role role = Role.valueOf(signupRequest.getRole().toUpperCase());
            User user = new User(signupRequest.getName().trim(), email, signupRequest.getPassword(), role, signupRequest.getMobile());
            User savedUser = userService.registerUser(user);
            
            return ResponseEntity.ok("Registration successful");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Registration failed");
        }
    }
    
    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@Valid @RequestBody ProfileUpdateRequest updateRequest,
                                          BindingResult bindingResult,
                                          Authentication authentication) {
        try {
            if (bindingResult.hasErrors()) {
                return getValidationErrors(bindingResult);
            }
            
            User currentUser = getCurrentUser(authentication);
            
            if (updateRequest.getName() != null && !updateRequest.getName().trim().isEmpty()) {
                String name = updateRequest.getName().trim();
                if (name.startsWith(" ") || name.endsWith(" ")) {
                    return ResponseEntity.badRequest().body("Name cannot start or end with spaces");
                }
                if (name.length() < 2 || name.length() > 100) {
                    return ResponseEntity.badRequest().body("Name must be between 2 and 100 characters");
                }
            }
            
            if (updateRequest.getMobile() != null && !updateRequest.getMobile().isEmpty()) {
                if (!updateRequest.getMobile().matches("^[0-9]{10}$")) {
                    return ResponseEntity.badRequest().body("Mobile number must be exactly 10 digits");
                }
            }
            
            User updatedUser = userService.updateUserProfile(currentUser.getUserId(), updateRequest);
            
            return ResponseEntity.ok("Profile updated successfully. Name: " + 
                                   updatedUser.getName() + ", Mobile: " + updatedUser.getMobile());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating profile: " + e.getMessage());
        }
    }
    
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(Authentication authentication) {
        try {
            User currentUser = getCurrentUser(authentication);
            
            ProfileResponse response = new ProfileResponse(
                currentUser.getUserId(),
                currentUser.getName(),
                currentUser.getEmail(),
                currentUser.getRole().name(),
                currentUser.getMobile(),
                currentUser.getCreatedAt()
            );
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching profile: " + e.getMessage());
        }
    }
    
    @PutMapping("/password")
    public ResponseEntity<?> updatePassword(@Valid @RequestBody PasswordUpdateRequest passwordRequest,
                                           BindingResult bindingResult,
                                           Authentication authentication) {
        try {
            if (bindingResult.hasErrors()) {
                return getValidationErrors(bindingResult);
            }
            
            User currentUser = getCurrentUser(authentication);
            
            if (!passwordRequest.getNewPassword().matches("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=\\S+$).{6,}$")) {
                return ResponseEntity.badRequest().body(
                    "New password must be at least 6 characters and contain at least one digit, " +
                    "one lowercase letter, one uppercase letter, and one special character"
                );
            }
            
            try {
                authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                        currentUser.getEmail(),
                        passwordRequest.getCurrentPassword()
                    )
                );
            } catch (Exception e) {
                return ResponseEntity.badRequest().body("Current password is incorrect");
            }
            
            userService.updateUserPassword(currentUser.getUserId(), passwordRequest.getNewPassword());
            
            return ResponseEntity.ok("Password updated successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating password: " + e.getMessage());
        }
    }
    
    private ResponseEntity<?> getValidationErrors(BindingResult bindingResult) {
        Map<String, String> errors = new HashMap<>();
        for (FieldError error : bindingResult.getFieldErrors()) {
            errors.put(error.getField(), error.getDefaultMessage());
        }
        return ResponseEntity.badRequest().body(errors);
    }
    
    private User getCurrentUser(Authentication authentication) {
        return userService.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}