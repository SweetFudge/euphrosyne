package com.euphrosyne.controller;

import com.euphrosyne.dto.CatalogueItemDto;
import com.euphrosyne.dto.CatalogueItemResponseDto;
import com.euphrosyne.dto.CataloguePhotoResponseDto;
import com.euphrosyne.mapper.CatalogueItemMapper;
import com.euphrosyne.mapper.CataloguePhotoMapper;
import com.euphrosyne.service.CatalogueService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/catalogue")
@RequiredArgsConstructor
public class CatalogueController {

    private final CatalogueService catalogueService;
    private final CatalogueItemMapper catalogueItemMapper;
    private final CataloguePhotoMapper cataloguePhotoMapper;

    @GetMapping
    public ResponseEntity<List<CatalogueItemResponseDto>> getPublished() {
        return ResponseEntity.ok(catalogueItemMapper.toResponseList(catalogueService.findPublished()));
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<CatalogueItemResponseDto>> getAll() {
        return ResponseEntity.ok(catalogueItemMapper.toResponseList(catalogueService.findAll()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CatalogueItemResponseDto> getById(@PathVariable Long id) {
        CatalogueItemResponseDto dto = catalogueItemMapper.toResponse(catalogueService.findPublishedById(id));
        dto.setPhotos(cataloguePhotoMapper.toResponseList(catalogueService.findPhotos(id)));
        return ResponseEntity.ok(dto);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CatalogueItemResponseDto> create(@Valid @RequestBody CatalogueItemDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(catalogueItemMapper.toResponse(catalogueService.create(dto)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CatalogueItemResponseDto> update(
            @PathVariable Long id,
            @Valid @RequestBody CatalogueItemDto dto) {
        return ResponseEntity.ok(catalogueItemMapper.toResponse(catalogueService.update(id, dto)));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CatalogueItemResponseDto> toggleStatus(@PathVariable Long id) {
        return ResponseEntity.ok(catalogueItemMapper.toResponse(catalogueService.toggleStatus(id)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        catalogueService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/photos")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CataloguePhotoResponseDto> addPhoto(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String imageUrl = body.get("imageUrl");
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(cataloguePhotoMapper.toResponse(catalogueService.addPhoto(id, imageUrl)));
    }

    @DeleteMapping("/{id}/photos/{photoId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deletePhoto(
            @PathVariable Long id,
            @PathVariable Long photoId) {
        catalogueService.deletePhoto(id, photoId);
        return ResponseEntity.noContent().build();
    }
}