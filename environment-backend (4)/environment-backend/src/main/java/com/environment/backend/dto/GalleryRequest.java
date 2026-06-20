package com.environment.backend.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
public class GalleryRequest {
    private String imageUrl;
    private String caption;
}