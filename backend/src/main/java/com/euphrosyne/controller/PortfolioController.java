package com.euphrosyne.controller;

import com.euphrosyne.dto.PortfolioItemDto;
import com.euphrosyne.dto.PortfolioItemResponseDto;
import com.euphrosyne.mapper.PortfolioItemMapper;
import com.euphrosyne.service.PortfolioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/portfolio")
@RequiredArgsConstructor
public class PortfolioController {

    private final PortfolioService portfolioService;
    private final PortfolioItemMapper portfolioItemMapper;

    @GetMapping
    public ResponseEntity<List<PortfolioItemResponseDto>> getPublished() {
        return ResponseEntity.ok(portfolioItemMapper.toResponseList(portfolioService.findPublished()));
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<PortfolioItemResponseDto>> getAll() {
        return ResponseEntity.ok(portfolioItemMapper.toResponseList(portfolioService.findAll()));
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
}
