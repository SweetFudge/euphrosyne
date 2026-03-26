package com.euphrosyne.dto;

import com.euphrosyne.model.Reservation.Status;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class StatusUpdateRequestDto {

    @NotNull(message = "Le statut est obligatoire")
    private Status status;
}
