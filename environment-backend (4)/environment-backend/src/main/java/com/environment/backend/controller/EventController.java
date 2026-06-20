// src/main/java/com/environment/backend/controller/EventController.java
package com.environment.backend.controller;

import com.environment.backend.dto.EventRequest;
import com.environment.backend.dto.EventResponse;
import com.environment.backend.entity.Event;
import com.environment.backend.entity.User;
import com.environment.backend.service.EventService;
import com.environment.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "*")
public class EventController {
    
    @Autowired
    private EventService eventService;
    
    @Autowired
    private UserService userService;
    
    @PostMapping
    public ResponseEntity<?> createEvent(@RequestBody EventRequest eventRequest, 
                                        Authentication authentication) {
        try {
            User currentUser = getCurrentUser(authentication);
            Event event = eventService.createEvent(eventRequest, currentUser);
            return ResponseEntity.ok(event);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating event: " + e.getMessage());
        }
    }
    
    @GetMapping
    public ResponseEntity<List<EventResponse>> getAllEvents() {
        List<EventResponse> events = eventService.getAllEvents();
        return ResponseEntity.ok(events);
    }
    
    @GetMapping("/upcoming")
    public ResponseEntity<List<EventResponse>> getUpcomingEvents() {
        List<EventResponse> events = eventService.getUpcomingEvents();
        return ResponseEntity.ok(events);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getEventById(@PathVariable Long id) {
        try {
            EventResponse event = eventService.getEventById(id);
            return ResponseEntity.ok(event);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Event not found: " + e.getMessage());
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateEvent(@PathVariable Long id, 
                                        @RequestBody EventRequest eventRequest,
                                        Authentication authentication) {
        try {
            User currentUser = getCurrentUser(authentication);
            Event event = eventService.updateEvent(id, eventRequest, currentUser);
            return ResponseEntity.ok(event);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating event: " + e.getMessage());
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEvent(@PathVariable Long id, Authentication authentication) {
        try {
            User currentUser = getCurrentUser(authentication);
            eventService.deleteEvent(id, currentUser);
            return ResponseEntity.ok("Event deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error deleting event: " + e.getMessage());
        }
    }
    
    private User getCurrentUser(Authentication authentication) {
        String email = authentication.getName();
        return userService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}