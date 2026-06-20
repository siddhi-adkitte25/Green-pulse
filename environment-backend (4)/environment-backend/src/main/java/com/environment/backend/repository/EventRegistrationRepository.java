// src/main/java/com/environment/backend/repository/EventRegistrationRepository.java
package com.environment.backend.repository;

import com.environment.backend.entity.EventRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.Optional;

public interface EventRegistrationRepository extends JpaRepository<EventRegistration, Long> {
    
    // Check if user is already registered for an event
    Optional<EventRegistration> findByUserUserIdAndEventEventId(Long userId, Long eventId);
    
    // Get all registrations for a user
    List<EventRegistration> findByUserUserIdOrderByRegisteredAtDesc(Long userId);
    
    // Get all registrations for an event
    List<EventRegistration> findByEventEventIdOrderByRegisteredAtDesc(Long eventId);
    
    // Get registration count for an event
    Long countByEventEventId(Long eventId);
    
    // Get registrations with user and event details
    @Query("SELECT er FROM EventRegistration er JOIN FETCH er.user JOIN FETCH er.event WHERE er.user.userId = :userId")
    List<EventRegistration> findByUserUserIdWithDetails(Long userId);
}