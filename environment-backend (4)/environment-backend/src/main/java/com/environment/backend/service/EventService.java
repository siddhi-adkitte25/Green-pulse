// src/main/java/com/environment/backend/service/EventService.java
package com.environment.backend.service;

import com.environment.backend.dto.EventRequest;
import com.environment.backend.dto.EventResponse;
import com.environment.backend.entity.Event;
import com.environment.backend.entity.User;
import com.environment.backend.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EventService {
    
    @Autowired
    private EventRepository eventRepository;
    
    @Autowired
    private UserService userService;
    
    public Event createEvent(EventRequest eventRequest, User creator) {
        Event event = new Event();
        event.setTitle(eventRequest.getTitle());
        event.setDescription(eventRequest.getDescription());
        event.setDate(eventRequest.getDate());
        event.setVenue(eventRequest.getVenue());
        event.setCreatedBy(creator);
        
        return eventRepository.save(event);
    }
    
    public List<EventResponse> getAllEvents() {
        List<Event> events = eventRepository.findAllWithCreator();
        return events.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public List<EventResponse> getUpcomingEvents() {
        List<Event> events = eventRepository.findByDateAfterOrderByDateAsc(LocalDateTime.now());
        return events.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public EventResponse getEventById(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        return convertToResponse(event);
    }
    
    public Event updateEvent(Long eventId, EventRequest eventRequest, User user) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        
        // Check if user is the creator or admin
        if (!event.getCreatedBy().getUserId().equals(user.getUserId()) && 
            !user.getRole().equals(com.environment.backend.entity.Role.ADMIN)) {
            throw new RuntimeException("Not authorized to update this event");
        }
        
        event.setTitle(eventRequest.getTitle());
        event.setDescription(eventRequest.getDescription());
        event.setDate(eventRequest.getDate());
        event.setVenue(eventRequest.getVenue());
        
        return eventRepository.save(event);
    }
    
    public void deleteEvent(Long eventId, User user) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        
        // Check if user is the creator or admin
        if (!event.getCreatedBy().getUserId().equals(user.getUserId()) && 
            !user.getRole().equals(com.environment.backend.entity.Role.ADMIN)) {
            throw new RuntimeException("Not authorized to delete this event");
        }
        
        eventRepository.delete(event);
    }
    
    private EventResponse convertToResponse(Event event) {
        return new EventResponse(
            event.getEventId(),
            event.getTitle(),
            event.getDescription(),
            event.getDate(),
            event.getVenue(),
            event.getCreatedBy().getName(),
            event.getCreatedAt()
        );
    }
}