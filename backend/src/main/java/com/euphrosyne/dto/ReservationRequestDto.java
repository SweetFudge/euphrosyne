package com.euphrosyne.dto;

import com.euphrosyne.model.Reservation.EventType;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class ReservationRequestDto {

    @NotBlank(message = "Le prénom est obligatoire")
    private String firstName;

    @NotBlank(message = "Le nom est obligatoire")
    private String lastName;

    @NotBlank(message = "L'email est obligatoire")
    @Email(message = "Email invalide")
    private String email;

    private String phone;

    @NotNull(message = "Le type d'événement est obligatoire")
    private EventType eventType;

    @NotNull(message = "La date est obligatoire")
    @Future(message = "La date doit être dans le futur")
    private LocalDate eventDate;

    @Min(value = 1, message = "Le nombre d'invités doit être supérieur à 0")
    private Integer guestCount;

    @DecimalMin(value = "0.0", message = "Le budget doit être positif")
    private BigDecimal budget;

    private String message;
}
