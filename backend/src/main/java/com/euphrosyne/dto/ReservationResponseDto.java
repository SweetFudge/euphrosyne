package com.euphrosyne.dto;

import com.euphrosyne.model.Reservation.EventType;
import com.euphrosyne.model.Reservation.Status;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class ReservationResponseDto {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private EventType eventType;
    private LocalDate eventDate;
    private Integer guestCount;
    private BigDecimal budget;
    private String message;
    private Status status;
    private LocalDateTime createdAt;
}
