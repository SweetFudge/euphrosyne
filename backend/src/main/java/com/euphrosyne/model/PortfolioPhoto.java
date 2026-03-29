package com.euphrosyne.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "portfolio_photos")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PortfolioPhoto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "portfolio_item_id", nullable = false)
    private PortfolioItem portfolioItem;

    @Column(nullable = false)
    private String imageUrl;

    @Builder.Default
    private int displayOrder = 0;

    @Column(nullable = false, updatable = false)
    @Builder.Default
    private Instant createdAt = Instant.now();
}
