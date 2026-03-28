package com.euphrosyne.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "newsletter_campaigns")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NewsletterCampaign {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String subject;

    @Column(columnDefinition = "LONGTEXT", nullable = false)
    private String htmlContent;

    @Column(columnDefinition = "LONGTEXT")
    private String designJson;

    @Column(nullable = false)
    private Integer recipientCount;

    @Builder.Default
    @Column(nullable = false, updatable = false)
    private Instant sentAt = Instant.now();
}
