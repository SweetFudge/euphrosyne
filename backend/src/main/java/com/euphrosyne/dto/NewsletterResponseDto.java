package com.euphrosyne.dto;

import lombok.Data;

import java.time.Instant;

@Data
public class NewsletterResponseDto {
    private Long id;
    private String email;
    private boolean active;
    private Instant subscribedAt;
}
