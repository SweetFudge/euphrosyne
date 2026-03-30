package com.euphrosyne.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "catalogue_photos")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CataloguePhoto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "catalogue_item_id", nullable = false)
    private CatalogueItem catalogueItem;

    @Column(nullable = false)
    private String imageUrl;

    @Builder.Default
    private int displayOrder = 0;

    @Column(nullable = false, updatable = false)
    @Builder.Default
    private Instant createdAt = Instant.now();
}