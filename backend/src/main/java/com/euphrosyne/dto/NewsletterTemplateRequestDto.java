package com.euphrosyne.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class NewsletterTemplateRequestDto {

    @NotBlank(message = "Le nom est obligatoire")
    private String name;

    @NotBlank(message = "Le design est obligatoire")
    private String designJson;

    @NotBlank(message = "Le contenu HTML est obligatoire")
    private String htmlContent;
}
