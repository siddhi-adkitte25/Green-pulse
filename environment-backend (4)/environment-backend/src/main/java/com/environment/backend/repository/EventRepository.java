// src/main/java/com/environment/backend/repository/EventRepository.java
package com.environment.backend.repository;

import com.environment.backend.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.time.LocalDateTime;
import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {
    
    // Find upcoming events
    List<Event> findByDateAfterOrderByDateAsc(LocalDateTime date);
    
    // Find events by creator
    List<Event> findByCreatedByUserIdOrderByCreatedAtDesc(Long userId);
    
    // Find events with user details
    @Query("SELECT e FROM Event e JOIN FETCH e.createdBy ORDER BY e.date ASC")
    List<Event> findAllWithCreator();
}