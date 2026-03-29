package com.euphrosyne.dto;

import lombok.Data;

@Data
public class PortfolioPhotoResponseDto {
    private Long id;
    private String imageUrl;
    private int displayOrder;
}
