package com.euphrosyne.controller;

import com.euphrosyne.dto.NewsletterRequestDto;
import com.euphrosyne.dto.NewsletterResponseDto;
import com.euphrosyne.mapper.NewsletterMapper;
import com.euphrosyne.service.NewsletterService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/newsletter")
@RequiredArgsConstructor
public class NewsletterController {

    private final NewsletterService newsletterService;
    private final NewsletterMapper newsletterMapper;

    @PostMapping("/subscribe")
    public ResponseEntity<Void> subscribe(@Valid @RequestBody NewsletterRequestDto request) {
        newsletterService.subscribe(request.getEmail());
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<NewsletterResponseDto>> getAll() {
        return ResponseEntity.ok(newsletterMapper.toResponseList(newsletterService.findAll()));
    }
}
