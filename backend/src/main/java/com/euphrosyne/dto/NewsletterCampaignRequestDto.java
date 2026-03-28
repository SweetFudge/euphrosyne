package com.euphrosyne.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class NewsletterCampaignRequestDto {

    @NotBlank(message = "Le sujet est obligatoire")
    private String subject;

    @NotBlank(message = "Le contenu HTML est obligatoire")
    private String htmlContent;

    private String designJson;
}
