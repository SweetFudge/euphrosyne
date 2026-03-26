package com.euphrosyne.repository;

import com.euphrosyne.model.ItemStatus;
import com.euphrosyne.model.PortfolioItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PortfolioItemRepository extends JpaRepository<PortfolioItem, Long> {
    List<PortfolioItem> findAllByOrderByCreatedAtDesc();
    List<PortfolioItem> findByStatusOrderByCreatedAtDesc(ItemStatus status);
}
