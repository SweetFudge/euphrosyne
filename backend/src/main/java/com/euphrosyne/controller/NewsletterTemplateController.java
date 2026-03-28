package com.euphrosyne.controller;

import com.euphrosyne.dto.NewsletterTemplateRequestDto;
import com.euphrosyne.dto.NewsletterTemplateResponseDto;
import com.euphrosyne.mapper.NewsletterTemplateMapper;
import com.euphrosyne.service.NewsletterTemplateService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/newsletter/templates")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class NewsletterTemplateController {

    private final NewsletterTemplateService newsletterTemplateService;
    private final NewsletterTemplateMapper newsletterTemplateMapper;

    @GetMapping
    public ResponseEntity<List<NewsletterTemplateResponseDto>> getAll() {
        return ResponseEntity.ok(newsletterTemplateMapper.toResponseList(newsletterTemplateService.findAll()));
    }

    @PostMapping
    public ResponseEntity<NewsletterTemplateResponseDto> create(@Valid @RequestBody NewsletterTemplateRequestDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(newsletterTemplateMapper.toResponse(newsletterTemplateService.create(dto)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        newsletterTemplateService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
