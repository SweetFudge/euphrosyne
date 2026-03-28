package com.euphrosyne.service;

import com.euphrosyne.dto.NewsletterTemplateRequestDto;
import com.euphrosyne.model.NewsletterTemplate;
import com.euphrosyne.repository.NewsletterTemplateRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class NewsletterTemplateServiceTest {

    @Mock
    private NewsletterTemplateRepository newsletterTemplateRepository;

    @InjectMocks
    private NewsletterTemplateService newsletterTemplateService;

    @Test
    void shouldReturnAllTemplates_orderedByDate() {
        // given
        when(newsletterTemplateRepository.findAllByOrderByCreatedAtDesc())
                .thenReturn(List.of(NewsletterTemplate.builder().id(1L).name("Bienvenue").build()));

        // when
        List<NewsletterTemplate> result = newsletterTemplateService.findAll();

        // then
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getName()).isEqualTo("Bienvenue");
    }

    @Test
    void shouldCreateTemplate_whenValidDto() {
        // given
        NewsletterTemplateRequestDto dto = new NewsletterTemplateRequestDto();
        dto.setName("Offre printemps");
        dto.setDesignJson("{\"body\":{}}");
        dto.setHtmlContent("<html><body>Hello</body></html>");

        NewsletterTemplate saved = NewsletterTemplate.builder()
                .id(1L).name("Offre printemps")
                .designJson("{\"body\":{}}")
                .htmlContent("<html><body>Hello</body></html>")
                .build();
        when(newsletterTemplateRepository.save(any(NewsletterTemplate.class))).thenReturn(saved);

        // when
        NewsletterTemplate result = newsletterTemplateService.create(dto);

        // then
        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getName()).isEqualTo("Offre printemps");
        verify(newsletterTemplateRepository).save(any(NewsletterTemplate.class));
    }

    @Test
    void shouldDeleteTemplate_whenIdExists() {
        // when
        newsletterTemplateService.delete(1L);

        // then
        verify(newsletterTemplateRepository).deleteById(1L);
    }
}
