package com.euphrosyne.service;

import com.euphrosyne.dto.PortfolioItemDto;
import com.euphrosyne.model.*;
import com.euphrosyne.repository.CategoryRepository;
import com.euphrosyne.repository.PortfolioItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PortfolioService {

    private final PortfolioItemRepository portfolioItemRepository;
    private final CategoryRepository categoryRepository;

    public List<PortfolioItem> findAll() {
        return portfolioItemRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<PortfolioItem> findPublished() {
        return portfolioItemRepository.findByStatusOrderByCreatedAtDesc(ItemStatus.PUBLISHED);
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
                .orElseThrow(() -> new RuntimeException("Item non trouvé : " + id));
        item.setTitle(dto.getTitle());
        item.setLocation(dto.getLocation());
        item.setImageUrl(dto.getImageUrl());
        item.setCategory(resolveCategory(dto.getCategoryId()));
        item.setDescription(dto.getDescription());
        return portfolioItemRepository.save(item);
    }

    public PortfolioItem toggleStatus(Long id) {
        PortfolioItem item = portfolioItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item non trouvé : " + id));
        item.setStatus(item.getStatus() == ItemStatus.DRAFT ? ItemStatus.PUBLISHED : ItemStatus.DRAFT);
        return portfolioItemRepository.save(item);
    }

    public void delete(Long id) {
        portfolioItemRepository.deleteById(id);
    }

    private Category resolveCategory(Long categoryId) {
        if (categoryId == null) return null;
        return categoryRepository.findById(categoryId).orElse(null);
    }
}
