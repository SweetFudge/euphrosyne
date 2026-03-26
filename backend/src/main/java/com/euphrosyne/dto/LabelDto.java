package com.euphrosyne.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class LabelDto {

    private Long id;
    private String key;

    @NotBlank(message = "Le nom est obligatoire")
    private String name;

    private String description;
    private LocalDateTime createdAt;
}
