package com.euphrosyne.dto;

import com.euphrosyne.model.ItemStatus;
import lombok.Data;

import java.util.List;

@Data
public class CatalogueItemResponseDto {
    private Long id;
    private String name;
    private String imageUrl;
    private String description;
    private ItemStatus status;
    private CategoryDto category;
    private List<LabelDto> labels;
}
