// src/main/java/com/environment/backend/controller/EventRegistrationController.java
package com.environment.backend.controller;

import com.environment.backend.dto.EventRegistrationRequest;
import com.environment.backend.dto.EventRegistrationResponse;
import com.environment.backend.entity.User;
import com.environment.backend.service.EventRegistrationService;
import com.environment.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/registrations")
@CrossOrigin(origins = "*")
public class EventRegistrationController {
    
    @Autowired
    private EventRegistrationService eventRegistrationService;
    
    @Autowired
    private UserService userService;
    
    @PostMapping("/register")
    public ResponseEntity<?> registerForEvent(@RequestBody EventRegistrationRequest request,
                                             Authentication authentication) {
        try {
            User currentUser = getCurrentUser(authentication);
            EventRegistrationResponse registration = eventRegistrationService.registerForEvent(request, currentUser);
            return ResponseEntity.ok(registration);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Registration failed: " + e.getMessage());
        }
    }
    
    @DeleteMapping("/event/{eventId}")
    public ResponseEntity<?> unregisterFromEvent(@PathVariable Long eventId,
                                                Authentication authentication) {
        try {
            User currentUser = getCurrentUser(authentication);
            eventRegistrationService.unregisterFromEvent(eventId, currentUser);
            return ResponseEntity.ok("Successfully unregistered from event");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Unregistration failed: " + e.getMessage());
        }
    }
    
    @GetMapping("/my-registrations")
    public ResponseEntity<List<EventRegistrationResponse>> getMyRegistrations(Authentication authentication) {
        User currentUser = getCurrentUser(authentication);
        List<EventRegistrationResponse> registrations = eventRegistrationService.getUserRegistrations(currentUser.getUserId());
        return ResponseEntity.ok(registrations);
    }
    
    @GetMapping("/event/{eventId}")
    public ResponseEntity<?> getEventRegistrations(@PathVariable Long eventId) {
        try {
            List<EventRegistrationResponse> registrations = eventRegistrationService.getEventRegistrations(eventId);
            return ResponseEntity.ok(registrations);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching registrations: " + e.getMessage());
        }
    }
    
    @GetMapping("/event/{eventId}/count")
    public ResponseEntity<Long> getRegistrationCount(@PathVariable Long eventId) {
        Long count = eventRegistrationService.getRegistrationCount(eventId);
        return ResponseEntity.ok(count);
    }
    
    @GetMapping("/event/{eventId}/check")
    public ResponseEntity<Boolean> checkUserRegistration(@PathVariable Long eventId,
                                                        Authentication authentication) {
        User currentUser = getCurrentUser(authentication);
        boolean isRegistered = eventRegistrationService.isUserRegistered(currentUser.getUserId(), eventId);
        return ResponseEntity.ok(isRegistered);
    }
    
    private User getCurrentUser(Authentication authentication) {
        String email = authentication.getName();
        return userService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}