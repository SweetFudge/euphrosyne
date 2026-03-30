package com.euphrosyne.service;

import com.euphrosyne.dto.PortfolioItemDto;
import com.euphrosyne.model.Category;
import com.euphrosyne.model.ItemStatus;
import com.euphrosyne.model.PortfolioItem;
import com.euphrosyne.model.PortfolioPhoto;
import com.euphrosyne.exception.ForbiddenException;
import com.euphrosyne.exception.ResourceNotFoundException;
import com.euphrosyne.repository.CategoryRepository;
import com.euphrosyne.repository.PortfolioItemRepository;
import com.euphrosyne.repository.PortfolioPhotoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PortfolioService {

    private final PortfolioItemRepository portfolioItemRepository;
    private final PortfolioPhotoRepository portfolioPhotoRepository;
    private final CategoryRepository categoryRepository;

    public List<PortfolioItem> findAll() {
        return portfolioItemRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<PortfolioItem> findPublished() {
        return portfolioItemRepository.findByStatusOrderByCreatedAtDesc(ItemStatus.PUBLISHED);
    }

    public PortfolioItem findById(Long id) {
        return portfolioItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Portfolio non trouvé : " + id));
    }

    public PortfolioItem findPublishedById(Long id) {
        return portfolioItemRepository.findById(id)
                .filter(item -> item.getStatus() == ItemStatus.PUBLISHED)
                .orElseThrow(() -> new ResourceNotFoundException("Portfolio non trouvé : " + id));
    }

    public PortfolioItem findPublishedByIdWithPhotos(Long id) {
        return portfolioItemRepository.findByIdWithPhotos(id)
                .filter(item -> item.getStatus() == ItemStatus.PUBLISHED)
                .orElseThrow(() -> new ResourceNotFoundException("Portfolio non trouvé : " + id));
    }

    public List<PortfolioPhoto> findPhotos(Long portfolioItemId) {
        return portfolioPhotoRepository.findByPortfolioItemIdOrderByDisplayOrderAscCreatedAtAsc(portfolioItemId);
    }


    public PortfolioItem create(PortfolioItemDto dto) {
        return portfolioItemRepository.save(PortfolioItem.builder()
                .title(dto.getTitle())
                .location(dto.getLocation())
                .imageUrl(dto.getImageUrl())
                .category(resolveCategory(dto.getCategoryId()))
                .description(dto.getDescription())
                .status(ItemStatus.DRAFT)
                .build());
    }

    public PortfolioItem update(Long id, PortfolioItemDto dto) {
        PortfolioItem item = portfolioItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item non trouvé : " + id));
        item.setTitle(dto.getTitle());
        item.setLocation(dto.getLocation());
        item.setImageUrl(dto.getImageUrl());
        item.setCategory(resolveCategory(dto.getCategoryId()));
        item.setDescription(dto.getDescription());
        return portfolioItemRepository.save(item);
    }

    public PortfolioItem toggleStatus(Long id) {
        PortfolioItem item = portfolioItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item non trouvé : " + id));
        item.setStatus(item.getStatus() == ItemStatus.DRAFT ? ItemStatus.PUBLISHED : ItemStatus.DRAFT);
        return portfolioItemRepository.save(item);
    }

    public void delete(Long id) {
        portfolioItemRepository.deleteById(id);
    }

    public PortfolioPhoto addPhoto(Long portfolioItemId, String imageUrl) {
        PortfolioItem item = portfolioItemRepository.findById(portfolioItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Portfolio non trouvé : " + portfolioItemId));
        int nextOrder = portfolioPhotoRepository
                .findByPortfolioItemIdOrderByDisplayOrderAscCreatedAtAsc(portfolioItemId).size();
        return portfolioPhotoRepository.save(PortfolioPhoto.builder()
                .portfolioItem(item)
                .imageUrl(imageUrl)
                .displayOrder(nextOrder)
                .build());
    }

    public void deletePhoto(Long portfolioItemId, Long photoId) {
        PortfolioPhoto photo = portfolioPhotoRepository.findById(photoId)
                .orElseThrow(() -> new ResourceNotFoundException("Photo non trouvée : " + photoId));
        if (!photo.getPortfolioItem().getId().equals(portfolioItemId)) {
            throw new ForbiddenException("Cette photo n'appartient pas à ce portfolio");
        }
        portfolioPhotoRepository.delete(photo);
    }

    private Category resolveCategory(Long categoryId) {
        if (categoryId == null) return null;
        return categoryRepository.findById(categoryId).orElse(null);
    }
}
