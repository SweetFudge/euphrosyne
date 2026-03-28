package com.euphrosyne.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "newsletter_templates")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NewsletterTemplate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "LONGTEXT", nullable = false)
    private String designJson;

    @Column(columnDefinition = "LONGTEXT", nullable = false)
    private String htmlContent;

    @Builder.Default
    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();
}
