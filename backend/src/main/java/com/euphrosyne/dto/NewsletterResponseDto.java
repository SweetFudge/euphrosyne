package com.euphrosyne.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class NewsletterResponseDto {
    private Long id;
    private String email;
    private boolean active;
    private LocalDateTime subscribedAt;
}
