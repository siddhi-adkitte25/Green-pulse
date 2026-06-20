// src/main/java/com/environment/backend/repository/ContactMessageRepository.java
package com.environment.backend.repository;

import com.environment.backend.entity.ContactMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ContactMessageRepository extends JpaRepository<ContactMessage, Long> {
    List<ContactMessage> findByOrderByCreatedAtDesc();
}