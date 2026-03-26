package com.euphrosyne.controller;

import com.euphrosyne.dto.ContactMessageDto;
import com.euphrosyne.dto.ContactMessageResponseDto;
import com.euphrosyne.mapper.ContactMessageMapper;
import com.euphrosyne.service.ContactService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contacts")
@RequiredArgsConstructor
public class ContactController {

    private final ContactService contactService;
    private final ContactMessageMapper contactMessageMapper;

    @PostMapping
    public ResponseEntity<Void> create(@Valid @RequestBody ContactMessageDto dto) {
        contactService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ContactMessageResponseDto>> getAll() {
        return ResponseEntity.ok(contactMessageMapper.toResponseList(contactService.findAll()));
    }

    @PutMapping("/{id}/read")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ContactMessageResponseDto> markAsRead(@PathVariable Long id) {
        return ResponseEntity.ok(contactMessageMapper.toResponse(contactService.markAsRead(id)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        contactService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
