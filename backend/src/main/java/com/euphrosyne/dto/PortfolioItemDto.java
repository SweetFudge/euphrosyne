package com.euphrosyne.dto;

import com.euphrosyne.model.ItemStatus;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PortfolioItemDto {

    @NotBlank(message = "Le titre est obligatoire")
    private String title;

    @NotBlank(message = "Le lieu est obligatoire")
    private String location;

    private String imageUrl;
    private Long categoryId;
    private String description;
    private ItemStatus status;
}
