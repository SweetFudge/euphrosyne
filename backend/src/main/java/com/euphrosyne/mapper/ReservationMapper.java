package com.euphrosyne.mapper;

import com.euphrosyne.dto.ReservationResponseDto;
import com.euphrosyne.model.Reservation;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ReservationMapper {
    ReservationResponseDto toResponse(Reservation reservation);
    List<ReservationResponseDto> toResponseList(List<Reservation> reservations);
}
