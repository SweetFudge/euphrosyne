package com.euphrosyne.dto;

import com.euphrosyne.model.CategoryScope;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.Instant;

@Data
public class CategoryDto {

    private Long id;
    private String key;

    @NotBlank(message = "Le nom est obligatoire")
    private String name;

    @NotNull(message = "Le scope est obligatoire")
    private CategoryScope scope;

    private String description;
    private Instant createdAt;
}
