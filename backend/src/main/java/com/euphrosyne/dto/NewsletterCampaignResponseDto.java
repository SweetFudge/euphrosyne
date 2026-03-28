package com.euphrosyne.dto;

import lombok.Data;

import java.time.Instant;

@Data
public class NewsletterCampaignResponseDto {
    private Long id;
    private String subject;
    private Integer recipientCount;
    private Instant sentAt;
}
