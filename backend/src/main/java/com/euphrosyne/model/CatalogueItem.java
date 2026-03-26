package com.euphrosyne.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "catalogue_items")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CatalogueItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String imageUrl;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "catalogue_item_labels",
            joinColumns = @JoinColumn(name = "catalogue_item_id"),
            inverseJoinColumns = @JoinColumn(name = "label_id")
    )
    @Builder.Default
    private List<Label> labels = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ItemStatus status = ItemStatus.DRAFT;

    @Column(nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
