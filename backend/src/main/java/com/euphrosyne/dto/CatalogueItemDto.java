package com.euphrosyne.dto;

import com.euphrosyne.model.ItemStatus;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class CatalogueItemDto {

    @NotBlank(message = "Le nom est obligatoire")
    private String name;

    private String imageUrl;
    private String description;
    private Long categoryId;
    private List<Long> labelIds = new ArrayList<>();
    private ItemStatus status;
}
