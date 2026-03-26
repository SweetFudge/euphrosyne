package com.euphrosyne.repository;

import com.euphrosyne.model.CatalogueItem;
import com.euphrosyne.model.ItemStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CatalogueItemRepository extends JpaRepository<CatalogueItem, Long> {
    List<CatalogueItem> findAllByOrderByCreatedAtDesc();
    List<CatalogueItem> findByStatusOrderByCreatedAtDesc(ItemStatus status);
}
