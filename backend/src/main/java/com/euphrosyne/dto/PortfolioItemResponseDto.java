package com.euphrosyne.dto;

import com.euphrosyne.model.ItemStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class PortfolioItemResponseDto {
    private Long id;
    private String title;
    private String location;
    private String imageUrl;
    private String description;
    private ItemStatus status;
    private CategoryDto category;
    private LocalDateTime createdAt;
}
