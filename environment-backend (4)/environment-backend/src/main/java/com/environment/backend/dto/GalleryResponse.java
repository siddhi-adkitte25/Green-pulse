package com.environment.backend.dto;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GalleryResponse {
    private Long imageId;
    private String imageUrl;
    private String caption;
    private LocalDateTime uploadedAt;
}