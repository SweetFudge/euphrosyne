package com.euphrosyne.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.Instant;

@Data
public class LabelDto {

    private Long id;
    private String key;

    @NotBlank(message = "Le nom est obligatoire")
    private String name;

    private String description;
    private Instant createdAt;
}
