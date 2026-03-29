package com.euphrosyne.controller;

import com.euphrosyne.dto.PortfolioItemDto;
import com.euphrosyne.dto.PortfolioItemResponseDto;
import com.euphrosyne.dto.PortfolioPhotoResponseDto;
import com.euphrosyne.mapper.PortfolioItemMapper;
import com.euphrosyne.mapper.PortfolioPhotoMapper;
import com.euphrosyne.service.PortfolioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/portfolio")
@RequiredArgsConstructor
public class PortfolioController {

    private final PortfolioService portfolioService;
    private final PortfolioItemMapper portfolioItemMapper;
    private final PortfolioPhotoMapper portfolioPhotoMapper;

    @GetMapping
    public ResponseEntity<List<PortfolioItemResponseDto>> getPublished() {
        return ResponseEntity.ok(portfolioItemMapper.toResponseList(portfolioService.findPublished()));
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<PortfolioItemResponseDto>> getAll() {
        return ResponseEntity.ok(portfolioItemMapper.toResponseList(portfolioService.findAll()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PortfolioItemResponseDto> getById(@PathVariable Long id) {
        PortfolioItemResponseDto dto = portfolioItemMapper.toResponse(portfolioService.findPublishedById(id));
        dto.setPhotos(portfolioPhotoMapper.toResponseList(portfolioService.findPhotos(id)));
        return ResponseEntity.ok(dto);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PortfolioItemResponseDto> create(@Valid @RequestBody PortfolioItemDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(portfolioItemMapper.toResponse(portfolioService.create(dto)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PortfolioItemResponseDto> update(
            @PathVariable Long id,
            @Valid @RequestBody PortfolioItemDto dto) {
        return ResponseEntity.ok(portfolioItemMapper.toResponse(portfolioService.update(id, dto)));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PortfolioItemResponseDto> toggleStatus(@PathVariable Long id) {
        return ResponseEntity.ok(portfolioItemMapper.toResponse(portfolioService.toggleStatus(id)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        portfolioService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/photos")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PortfolioPhotoResponseDto> addPhoto(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String imageUrl = body.get("imageUrl");
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(portfolioPhotoMapper.toResponse(portfolioService.addPhoto(id, imageUrl)));
    }

    @DeleteMapping("/{id}/photos/{photoId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deletePhoto(
            @PathVariable Long id,
            @PathVariable Long photoId) {
        portfolioService.deletePhoto(id, photoId);
        return ResponseEntity.noContent().build();
    }
}
