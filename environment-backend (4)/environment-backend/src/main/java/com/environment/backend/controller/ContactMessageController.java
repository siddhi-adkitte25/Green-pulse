// src/main/java/com/environment/backend/controller/ContactMessageController.java
package com.environment.backend.controller;

import com.environment.backend.dto.ContactMessageRequest;
import com.environment.backend.dto.ContactMessageResponse;
import com.environment.backend.entity.User;
import com.environment.backend.service.ContactMessageService;
import com.environment.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin(origins = "*")
public class ContactMessageController {
    
    @Autowired
    private ContactMessageService contactMessageService;
    
    @Autowired
    private UserService userService;
    
    @PostMapping
    public ResponseEntity<?> submitMessage(@RequestBody ContactMessageRequest request) {
        try {
            ContactMessageResponse message = contactMessageService.submitMessage(request);
            return ResponseEntity.ok(message);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error submitting message: " + e.getMessage());
        }
    }
    
    @GetMapping
    public ResponseEntity<List<ContactMessageResponse>> getAllMessages(Authentication authentication) {
        try {
            User currentUser = getCurrentUser(authentication);
            
            // Only admins can view contact messages
            if (!currentUser.getRole().equals(com.environment.backend.entity.Role.ADMIN)) {
                return ResponseEntity.badRequest().body(null);
            }
            
            List<ContactMessageResponse> messages = contactMessageService.getAllMessages();
            return ResponseEntity.ok(messages);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMessage(@PathVariable Long id, Authentication authentication) {
        try {
            User currentUser = getCurrentUser(authentication);
            
            // Only admins can delete contact messages
            if (!currentUser.getRole().equals(com.environment.backend.entity.Role.ADMIN)) {
                return ResponseEntity.badRequest().body("Only admins can delete contact messages");
            }
            
            contactMessageService.deleteMessage(id);
            return ResponseEntity.ok("Message deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error deleting message: " + e.getMessage());
        }
    }
    
    private User getCurrentUser(Authentication authentication) {
        String email = authentication.getName();
        return userService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}