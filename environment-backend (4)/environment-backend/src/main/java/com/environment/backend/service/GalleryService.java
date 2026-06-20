// src/main/java/com/environment/backend/service/GalleryService.java
package com.environment.backend.service;

import com.environment.backend.dto.GalleryRequest;
import com.environment.backend.dto.GalleryResponse;
import com.environment.backend.entity.Gallery;
import com.environment.backend.repository.GalleryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class GalleryService {
    
    @Autowired
    private GalleryRepository galleryRepository;
    
    public GalleryResponse addImage(GalleryRequest request) {
        Gallery gallery = new Gallery();
        gallery.setImageUrl(request.getImageUrl());
        gallery.setCaption(request.getCaption());
        
        Gallery savedImage = galleryRepository.save(gallery);
        return convertToResponse(savedImage);
    }
    
    public List<GalleryResponse> getAllImages() {
        List<Gallery> images = galleryRepository.findByOrderByUploadedAtDesc();
        return images.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public void deleteImage(Long imageId) {
        galleryRepository.deleteById(imageId);
    }
    
    private GalleryResponse convertToResponse(Gallery gallery) {
        return new GalleryResponse(
            gallery.getImageId(),
            gallery.getImageUrl(),
            gallery.getCaption(),
            gallery.getUploadedAt()
        );
    }
}