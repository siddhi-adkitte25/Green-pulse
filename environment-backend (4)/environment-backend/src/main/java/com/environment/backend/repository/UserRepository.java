// src/main/java/com/environment/backend/repository/UserRepository.java
package com.environment.backend.repository;

import com.environment.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Boolean existsByEmail(String email);
}