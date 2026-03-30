package com.euphrosyne.repository;

import com.euphrosyne.model.ItemStatus;
import com.euphrosyne.model.PortfolioItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PortfolioItemRepository extends JpaRepository<PortfolioItem, Long> {
    List<PortfolioItem> findAllByOrderByCreatedAtDesc();
    List<PortfolioItem> findByStatusOrderByCreatedAtDesc(ItemStatus status);

    @Query("SELECT p FROM PortfolioItem p LEFT JOIN FETCH p.photos WHERE p.id = :id")
    Optional<PortfolioItem> findByIdWithPhotos(@Param("id") Long id);
}
