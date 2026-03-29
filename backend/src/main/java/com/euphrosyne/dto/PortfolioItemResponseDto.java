package com.euphrosyne.dto;

import com.euphrosyne.model.ItemStatus;
import lombok.Data;

import java.time.Instant;
import java.util.List;

@Data
public class PortfolioItemResponseDto {
    private Long id;
    private String title;
    private String location;
    private String imageUrl;
    private String description;
    private ItemStatus status;
    private CategoryDto category;
    private Instant createdAt;
    private List<PortfolioPhotoResponseDto> photos;
}
