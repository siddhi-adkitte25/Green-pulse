// src/main/java/com/environment/backend/repository/GalleryRepository.java
package com.environment.backend.repository;

import com.environment.backend.entity.Gallery;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface GalleryRepository extends JpaRepository<Gallery, Long> {
    List<Gallery> findByOrderByUploadedAtDesc();
}