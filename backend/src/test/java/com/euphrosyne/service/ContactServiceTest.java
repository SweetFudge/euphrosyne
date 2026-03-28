package com.euphrosyne.service;

import com.euphrosyne.dto.ContactMessageDto;
import com.euphrosyne.model.ContactMessage;
import com.euphrosyne.repository.ContactMessageRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ContactServiceTest {

    @Mock
    private ContactMessageRepository contactMessageRepository;

    @InjectMocks
    private ContactService contactService;

    @Test
    void shouldCreateMessage_whenValidDto() {
        // given
        ContactMessageDto dto = new ContactMessageDto();
        dto.setFirstName("Jean");
        dto.setLastName("Martin");
        dto.setEmail("jean@example.com");
        dto.setMessage("Bonjour");

        ContactMessage saved = ContactMessage.builder().id(1L).firstName("Jean").lastName("Martin").email("jean@example.com").build();
        when(contactMessageRepository.save(any(ContactMessage.class))).thenReturn(saved);

        // when
        ContactMessage result = contactService.create(dto);

        // then
        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getFirstName()).isEqualTo("Jean");
        verify(contactMessageRepository).save(any(ContactMessage.class));
    }

    @Test
    void shouldReturnAllMessages_orderedByDate() {
        // given
        when(contactMessageRepository.findAllByOrderByCreatedAtDesc())
                .thenReturn(List.of(ContactMessage.builder().id(1L).build()));

        // when
        List<ContactMessage> result = contactService.findAll();

        // then
        assertThat(result).hasSize(1);
    }

    @Test
    void shouldMarkMessageAsRead_whenMessageExists() {
        // given
        ContactMessage msg = ContactMessage.builder().id(1L).read(false).build();
        when(contactMessageRepository.findById(1L)).thenReturn(Optional.of(msg));
        when(contactMessageRepository.save(any(ContactMessage.class))).thenReturn(msg);

        // when
        ContactMessage result = contactService.markAsRead(1L);

        // then
        assertThat(result.isRead()).isTrue();
    }

    @Test
    void shouldThrowException_whenMarkingNonExistentMessageAsRead() {
        // given
        when(contactMessageRepository.findById(99L)).thenReturn(Optional.empty());

        // when / then
        assertThatThrownBy(() -> contactService.markAsRead(99L))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("99");
    }

    @Test
    void shouldDeleteMessage_whenIdExists() {
        // when
        contactService.delete(1L);

        // then
        verify(contactMessageRepository).deleteById(1L);
    }

    @Test
    void shouldReturnUnreadCount() {
        // given
        when(contactMessageRepository.countByReadFalse()).thenReturn(5L);

        // when
        long count = contactService.countUnread();

        // then
        assertThat(count).isEqualTo(5L);
    }
}
