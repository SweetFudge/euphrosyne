package com.euphrosyne.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class ContactMessageResponseDto {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String eventType;
    private LocalDate eventDate;
    private String message;
    private boolean read;
    private LocalDateTime createdAt;
}
