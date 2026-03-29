package com.euphrosyne.service;

import com.euphrosyne.dto.ContactMessageDto;
import com.euphrosyne.model.ContactMessage;
import com.euphrosyne.exception.ResourceNotFoundException;
import com.euphrosyne.repository.ContactMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ContactService {

    private final ContactMessageRepository contactMessageRepository;

    public ContactMessage create(ContactMessageDto dto) {
        ContactMessage msg = ContactMessage.builder()
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .email(dto.getEmail())
                .eventType(dto.getEventType())
                .eventDate(dto.getEventDate())
                .message(dto.getMessage())
                .build();
        return contactMessageRepository.save(msg);
    }

    public List<ContactMessage> findAll() {
        return contactMessageRepository.findAllByOrderByCreatedAtDesc();
    }

    public ContactMessage markAsRead(Long id) {
        ContactMessage msg = contactMessageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Message non trouvé : " + id));
        msg.setRead(true);
        return contactMessageRepository.save(msg);
    }

    public void delete(Long id) {
        contactMessageRepository.deleteById(id);
    }

    public long countUnread() {
        return contactMessageRepository.countByReadFalse();
    }
}
