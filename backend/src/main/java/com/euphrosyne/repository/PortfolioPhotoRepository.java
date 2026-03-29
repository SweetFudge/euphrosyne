package com.euphrosyne.repository;

import com.euphrosyne.model.PortfolioPhoto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PortfolioPhotoRepository extends JpaRepository<PortfolioPhoto, Long> {
    List<PortfolioPhoto> findByPortfolioItemIdOrderByDisplayOrderAscCreatedAtAsc(Long portfolioItemId);
    void deleteByPortfolioItemId(Long portfolioItemId);
}
