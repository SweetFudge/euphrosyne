package com.euphrosyne.service;

import com.euphrosyne.dto.NewsletterTemplateRequestDto;
import com.euphrosyne.model.NewsletterTemplate;
import com.euphrosyne.repository.NewsletterTemplateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NewsletterTemplateService {

    private final NewsletterTemplateRepository newsletterTemplateRepository;

    public List<NewsletterTemplate> findAll() {
        return newsletterTemplateRepository.findAllByOrderByCreatedAtDesc();
    }

    public NewsletterTemplate create(NewsletterTemplateRequestDto dto) {
        return newsletterTemplateRepository.save(NewsletterTemplate.builder()
                .name(dto.getName())
                .designJson(dto.getDesignJson())
                .htmlContent(dto.getHtmlContent())
                .build());
    }

    public void delete(Long id) {
        newsletterTemplateRepository.deleteById(id);
    }
}
