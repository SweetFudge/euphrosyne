package com.euphrosyne.service;

import com.euphrosyne.dto.NewsletterCampaignRequestDto;
import com.euphrosyne.model.Newsletter;
import com.euphrosyne.model.NewsletterCampaign;
import com.euphrosyne.repository.NewsletterCampaignRepository;
import com.euphrosyne.repository.NewsletterRepository;
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
class NewsletterCampaignServiceTest {

    @Mock
    private NewsletterCampaignRepository newsletterCampaignRepository;

    @Mock
    private NewsletterRepository newsletterRepository;

    @InjectMocks
    private NewsletterCampaignService newsletterCampaignService;

    @Test
    void shouldReturnAllCampaigns_orderedByDate() {
        // given
        when(newsletterCampaignRepository.findAllByOrderBySentAtDesc())
                .thenReturn(List.of(NewsletterCampaign.builder().id(1L).subject("Offre printemps").build()));

        // when
        List<NewsletterCampaign> result = newsletterCampaignService.findAll();

        // then
        assertThat(result).hasSize(1);
    }

    @Test
    void shouldSendCampaign_andRecordRecipientCount() {
        // given
        NewsletterCampaignRequestDto dto = new NewsletterCampaignRequestDto();
        dto.setSubject("Offre été");
        dto.setHtmlContent("<html><body>Bonjour</body></html>");

        List<Newsletter> activeSubscribers = List.of(
                Newsletter.builder().email("a@test.com").build(),
                Newsletter.builder().email("b@test.com").build()
        );
        when(newsletterRepository.findAllByActiveTrue()).thenReturn(activeSubscribers);
        when(newsletterCampaignRepository.save(any(NewsletterCampaign.class)))
                .thenAnswer(inv -> inv.getArgument(0));

        // when
        NewsletterCampaign result = newsletterCampaignService.send(dto);

        // then
        assertThat(result.getSubject()).isEqualTo("Offre été");
        assertThat(result.getRecipientCount()).isEqualTo(2);
        verify(newsletterCampaignRepository).save(any(NewsletterCampaign.class));
    }

    @Test
    void shouldSendCampaign_withZeroRecipients_whenNoActiveSubscribers() {
        // given
        NewsletterCampaignRequestDto dto = new NewsletterCampaignRequestDto();
        dto.setSubject("Test");
        dto.setHtmlContent("<html></html>");

        when(newsletterRepository.findAllByActiveTrue()).thenReturn(List.of());
        when(newsletterCampaignRepository.save(any(NewsletterCampaign.class)))
                .thenAnswer(inv -> inv.getArgument(0));

        // when
        NewsletterCampaign result = newsletterCampaignService.send(dto);

        // then
        assertThat(result.getRecipientCount()).isEqualTo(0);
    }
}
