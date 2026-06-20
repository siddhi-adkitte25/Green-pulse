// src/main/java/com/environment/backend/service/EventRegistrationService.java
package com.environment.backend.service;

import com.environment.backend.dto.EventRegistrationRequest;
import com.environment.backend.dto.EventRegistrationResponse;
import com.environment.backend.entity.Event;
import com.environment.backend.entity.EventRegistration;
import com.environment.backend.entity.User;
import com.environment.backend.repository.EventRegistrationRepository;
import com.environment.backend.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EventRegistrationService {
    
    @Autowired
    private EventRegistrationRepository eventRegistrationRepository;
    
    @Autowired
    private EventRepository eventRepository;
    
    @Autowired
    private UserService userService;
    
    public EventRegistrationResponse registerForEvent(EventRegistrationRequest request, User user) {
        // Check if event exists
        Event event = eventRepository.findById(request.getEventId())
                .orElseThrow(() -> new RuntimeException("Event not found"));
        
        // Check if user is already registered
        if (eventRegistrationRepository.findByUserUserIdAndEventEventId(user.getUserId(), event.getEventId()).isPresent()) {
            throw new RuntimeException("You are already registered for this event");
        }
        
        // Create registration
        EventRegistration registration = new EventRegistration(user, event);
        EventRegistration savedRegistration = eventRegistrationRepository.save(registration);
        
        return convertToResponse(savedRegistration);
    }
    
    public void unregisterFromEvent(Long eventId, User user) {
        EventRegistration registration = eventRegistrationRepository
                .findByUserUserIdAndEventEventId(user.getUserId(), eventId)
                .orElseThrow(() -> new RuntimeException("Registration not found"));
        
        eventRegistrationRepository.delete(registration);
    }
    
    public List<EventRegistrationResponse> getUserRegistrations(Long userId) {
        List<EventRegistration> registrations = eventRegistrationRepository.findByUserUserIdWithDetails(userId);
        return registrations.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public List<EventRegistrationResponse> getEventRegistrations(Long eventId) {
        List<EventRegistration> registrations = eventRegistrationRepository.findByEventEventIdOrderByRegisteredAtDesc(eventId);
        return registrations.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public Long getRegistrationCount(Long eventId) {
        return eventRegistrationRepository.countByEventEventId(eventId);
    }
    
    public boolean isUserRegistered(Long userId, Long eventId) {
        return eventRegistrationRepository.findByUserUserIdAndEventEventId(userId, eventId).isPresent();
    }
    
    private EventRegistrationResponse convertToResponse(EventRegistration registration) {
        return new EventRegistrationResponse(
            registration.getRegId(),
            registration.getEvent().getEventId(),
            registration.getEvent().getTitle(),
            registration.getEvent().getDate(),
            registration.getEvent().getVenue(),
            registration.getUser().getName(),
            registration.getUser().getEmail(),
            registration.getRegisteredAt()
        );
    }
}