package com.euphrosyne.controller;

import com.euphrosyne.dto.NewsletterCampaignRequestDto;
import com.euphrosyne.dto.NewsletterCampaignResponseDto;
import com.euphrosyne.mapper.NewsletterCampaignMapper;
import com.euphrosyne.service.NewsletterCampaignService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/newsletter/campaigns")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class NewsletterCampaignController {

    private final NewsletterCampaignService newsletterCampaignService;
    private final NewsletterCampaignMapper newsletterCampaignMapper;

    @GetMapping
    public ResponseEntity<List<NewsletterCampaignResponseDto>> getAll() {
        return ResponseEntity.ok(newsletterCampaignMapper.toResponseList(newsletterCampaignService.findAll()));
    }

    @PostMapping("/send")
    public ResponseEntity<NewsletterCampaignResponseDto> send(@Valid @RequestBody NewsletterCampaignRequestDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(newsletterCampaignMapper.toResponse(newsletterCampaignService.send(dto)));
    }
}
