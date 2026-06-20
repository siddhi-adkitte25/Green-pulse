package com.environment.backend.controller;

import com.environment.backend.entity.User;
import com.environment.backend.entity.Role;
import com.environment.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers(Authentication authentication) {
        try {
            User currentUser = getCurrentUser(authentication);
            
            // Only admin can access all users
            if (!currentUser.getRole().equals(Role.ADMIN)) {
                return ResponseEntity.status(403).body("Access denied. Admin role required.");
            }
            
            List<User> users = userService.getAllUsers();
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching users: " + e.getMessage());
        }
    }
    
    @GetMapping("/volunteers")
    public ResponseEntity<?> getAllVolunteers(Authentication authentication) {
        try {
            User currentUser = getCurrentUser(authentication);
            
            // Only admin can access volunteers list
            if (!currentUser.getRole().equals(Role.ADMIN)) {
                return ResponseEntity.status(403).body("Access denied. Admin role required.");
            }
            
            List<User> allUsers = userService.getAllUsers();
            List<User> volunteers = allUsers.stream()
                    .filter(user -> user.getRole().equals(Role.USER))
                    .collect(Collectors.toList());
            
            return ResponseEntity.ok(volunteers);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching volunteers: " + e.getMessage());
        }
    }
    
    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id, Authentication authentication) {
        try {
            User currentUser = getCurrentUser(authentication);
            
            // Only admin can delete users
            if (!currentUser.getRole().equals(Role.ADMIN)) {
                return ResponseEntity.status(403).body("Access denied. Admin role required.");
            }
            
            userService.deleteUser(id, currentUser);
            return ResponseEntity.ok("User deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error deleting user: " + e.getMessage());
        }
    }
    
    private User getCurrentUser(Authentication authentication) {
        String email = authentication.getName();
        return userService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}