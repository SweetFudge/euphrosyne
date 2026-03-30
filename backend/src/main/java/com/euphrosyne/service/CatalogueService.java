package com.euphrosyne.service;

import com.euphrosyne.dto.CatalogueItemDto;
import com.euphrosyne.model.*;
import com.euphrosyne.exception.ForbiddenException;
import com.euphrosyne.exception.ResourceNotFoundException;
import com.euphrosyne.repository.CatalogueItemRepository;
import com.euphrosyne.repository.CataloguePhotoRepository;
import com.euphrosyne.repository.CategoryRepository;
import com.euphrosyne.repository.LabelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CatalogueService {

    private final CatalogueItemRepository catalogueItemRepository;
    private final CataloguePhotoRepository cataloguePhotoRepository;
    private final CategoryRepository categoryRepository;
    private final LabelRepository labelRepository;

    public List<CatalogueItem> findAll() {
        return catalogueItemRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<CatalogueItem> findPublished() {
        return catalogueItemRepository.findByStatusOrderByCreatedAtDesc(ItemStatus.PUBLISHED);
    }

    public CatalogueItem findById(Long id) {
        return catalogueItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Article non trouvé : " + id));
    }

    public CatalogueItem findPublishedById(Long id) {
        return catalogueItemRepository.findById(id)
                .filter(item -> item.getStatus() == ItemStatus.PUBLISHED)
                .orElseThrow(() -> new ResourceNotFoundException("Article non trouvé : " + id));
    }

    public CatalogueItem findPublishedByIdWithPhotos(Long id) {
        return catalogueItemRepository.findByIdWithPhotos(id)
                .filter(item -> item.getStatus() == ItemStatus.PUBLISHED)
                .orElseThrow(() -> new ResourceNotFoundException("Article non trouvé : " + id));
    }

    public List<CataloguePhoto> findPhotos(Long catalogueItemId) {
        return cataloguePhotoRepository.findByCatalogueItemIdOrderByDisplayOrderAscCreatedAtAsc(catalogueItemId);
    }

    public CatalogueItem create(CatalogueItemDto dto) {
        return catalogueItemRepository.save(CatalogueItem.builder()
                .name(dto.getName())
                .imageUrl(dto.getImageUrl())
                .description(dto.getDescription())
                .category(resolveCategory(dto.getCategoryId()))
                .labels(resolveLabels(dto.getLabelIds()))
                .status(ItemStatus.DRAFT)
                .build());
    }

    public CatalogueItem update(Long id, CatalogueItemDto dto) {
        CatalogueItem item = catalogueItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Article non trouvé : " + id));
        item.setName(dto.getName());
        item.setImageUrl(dto.getImageUrl());
        item.setDescription(dto.getDescription());
        item.setCategory(resolveCategory(dto.getCategoryId()));
        item.setLabels(resolveLabels(dto.getLabelIds()));
        return catalogueItemRepository.save(item);
    }

    public CatalogueItem toggleStatus(Long id) {
        CatalogueItem item = catalogueItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Article non trouvé : " + id));
        item.setStatus(item.getStatus() == ItemStatus.DRAFT ? ItemStatus.PUBLISHED : ItemStatus.DRAFT);
        return catalogueItemRepository.save(item);
    }

    public void delete(Long id) {
        catalogueItemRepository.deleteById(id);
    }

    public CataloguePhoto addPhoto(Long catalogueItemId, String imageUrl) {
        CatalogueItem item = catalogueItemRepository.findById(catalogueItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Article non trouvé : " + catalogueItemId));
        int nextOrder = cataloguePhotoRepository
                .findByCatalogueItemIdOrderByDisplayOrderAscCreatedAtAsc(catalogueItemId).size();
        return cataloguePhotoRepository.save(CataloguePhoto.builder()
                .catalogueItem(item)
                .imageUrl(imageUrl)
                .displayOrder(nextOrder)
                .build());
    }

    public void deletePhoto(Long catalogueItemId, Long photoId) {
        CataloguePhoto photo = cataloguePhotoRepository.findById(photoId)
                .orElseThrow(() -> new ResourceNotFoundException("Photo non trouvée : " + photoId));
        if (!photo.getCatalogueItem().getId().equals(catalogueItemId)) {
            throw new ForbiddenException("Cette photo n'appartient pas à cet article");
        }
        cataloguePhotoRepository.delete(photo);
    }

    private Category resolveCategory(Long categoryId) {
        if (categoryId == null) return null;
        return categoryRepository.findById(categoryId).orElse(null);
    }

    private List<Label> resolveLabels(List<Long> labelIds) {
        if (labelIds == null || labelIds.isEmpty()) return new ArrayList<>();
        return labelRepository.findAllById(labelIds);
    }
}