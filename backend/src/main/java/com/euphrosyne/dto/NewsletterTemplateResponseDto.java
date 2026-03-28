package com.euphrosyne.dto;

import lombok.Data;

import java.time.Instant;

@Data
public class NewsletterTemplateResponseDto {
    private Long id;
    private String name;
    private String designJson;
    private String htmlContent;
    private Instant createdAt;
}
