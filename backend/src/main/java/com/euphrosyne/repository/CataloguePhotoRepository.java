package com.euphrosyne.repository;

import com.euphrosyne.model.CataloguePhoto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CataloguePhotoRepository extends JpaRepository<CataloguePhoto, Long> {
    List<CataloguePhoto> findByCatalogueItemIdOrderByDisplayOrderAscCreatedAtAsc(Long catalogueItemId);
    void deleteByCatalogueItemId(Long catalogueItemId);
}