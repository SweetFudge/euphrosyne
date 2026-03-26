package com.euphrosyne.controller;

import com.euphrosyne.dto.CatalogueItemDto;
import com.euphrosyne.dto.CatalogueItemResponseDto;
import com.euphrosyne.mapper.CatalogueItemMapper;
import com.euphrosyne.service.CatalogueService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/catalogue")
@RequiredArgsConstructor
public class CatalogueController {

    private final CatalogueService catalogueService;
    private final CatalogueItemMapper catalogueItemMapper;

    @GetMapping
    public ResponseEntity<List<CatalogueItemResponseDto>> getPublished() {
        return ResponseEntity.ok(catalogueItemMapper.toResponseList(catalogueService.findPublished()));
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<CatalogueItemResponseDto>> getAll() {
        return ResponseEntity.ok(catalogueItemMapper.toResponseList(catalogueService.findAll()));
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
}
