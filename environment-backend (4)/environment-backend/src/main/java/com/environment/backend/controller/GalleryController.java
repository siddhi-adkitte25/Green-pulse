// src/main/java/com/environment/backend/controller/GalleryController.java
package com.environment.backend.controller;

import com.environment.backend.dto.GalleryRequest;
import com.environment.backend.dto.GalleryResponse;
import com.environment.backend.entity.User;
import com.environment.backend.service.GalleryService;
import com.environment.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/gallery")
@CrossOrigin(origins = "*")
public class GalleryController {
    
    @Autowired
    private GalleryService galleryService;
    
    @Autowired
    private UserService userService;
    
    @PostMapping
    public ResponseEntity<?> addImage(@RequestBody GalleryRequest request,
                                     Authentication authentication) {
        try {
            User currentUser = getCurrentUser(authentication);
            
            // Only admins can add images
            if (!currentUser.getRole().equals(com.environment.backend.entity.Role.ADMIN)) {
                return ResponseEntity.badRequest().body("Only admins can add gallery images");
            }
            
            GalleryResponse image = galleryService.addImage(request);
            return ResponseEntity.ok(image);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error adding image: " + e.getMessage());
        }
    }
    
    @GetMapping
    public ResponseEntity<List<GalleryResponse>> getAllImages() {
        List<GalleryResponse> images = galleryService.getAllImages();
        return ResponseEntity.ok(images);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteImage(@PathVariable Long id, Authentication authentication) {
        try {
            User currentUser = getCurrentUser(authentication);
            
            // Only admins can delete images
            if (!currentUser.getRole().equals(com.environment.backend.entity.Role.ADMIN)) {
                return ResponseEntity.badRequest().body("Only admins can delete gallery images");
            }
            
            galleryService.deleteImage(id);
            return ResponseEntity.ok("Image deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error deleting image: " + e.getMessage());
        }
    }
    
    private User getCurrentUser(Authentication authentication) {
        String email = authentication.getName();
        return userService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}