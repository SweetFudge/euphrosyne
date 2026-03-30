package com.euphrosyne.repository;

import com.euphrosyne.model.CatalogueItem;
import com.euphrosyne.model.ItemStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CatalogueItemRepository extends JpaRepository<CatalogueItem, Long> {
    List<CatalogueItem> findAllByOrderByCreatedAtDesc();
    List<CatalogueItem> findByStatusOrderByCreatedAtDesc(ItemStatus status);

    @Query("SELECT c FROM CatalogueItem c LEFT JOIN FETCH c.photos WHERE c.id = :id")
    Optional<CatalogueItem> findByIdWithPhotos(@Param("id") Long id);
}
