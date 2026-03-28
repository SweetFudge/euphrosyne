package com.euphrosyne.service;

import com.euphrosyne.model.Newsletter;
import com.euphrosyne.repository.NewsletterRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class NewsletterServiceTest {

    @Mock
    private NewsletterRepository newsletterRepository;

    @InjectMocks
    private NewsletterService newsletterService;

    @Test
    void shouldSubscribe_whenEmailIsNew() {
        // given
        String email = "nouveau@example.com";
        Newsletter saved = Newsletter.builder().id(1L).email(email).build();
        when(newsletterRepository.existsByEmail(email)).thenReturn(false);
        when(newsletterRepository.save(any(Newsletter.class))).thenReturn(saved);

        // when
        Newsletter result = newsletterService.subscribe(email);

        // then
        assertThat(result.getEmail()).isEqualTo(email);
        verify(newsletterRepository).save(any(Newsletter.class));
    }

    @Test
    void shouldThrowException_whenEmailAlreadySubscribed() {
        // given
        String email = "deja@example.com";
        when(newsletterRepository.existsByEmail(email)).thenReturn(true);

        // when / then
        assertThatThrownBy(() -> newsletterService.subscribe(email))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("déjà inscrit");
    }

    @Test
    void shouldReturnAllSubscribers_orderedByDate() {
        // given
        when(newsletterRepository.findAllByOrderBySubscribedAtDesc())
                .thenReturn(List.of(Newsletter.builder().id(1L).build()));

        // when
        List<Newsletter> result = newsletterService.findAll();

        // then
        assertThat(result).hasSize(1);
    }

    @Test
    void shouldReturnActiveSubscriberCount() {
        // given
        when(newsletterRepository.countByActive(true)).thenReturn(10L);

        // when
        long count = newsletterService.countActive();

        // then
        assertThat(count).isEqualTo(10L);
    }
}
