package com.euphrosyne.controller;

import com.euphrosyne.dto.ReservationRequestDto;
import com.euphrosyne.dto.ReservationResponseDto;
import com.euphrosyne.dto.StatusUpdateRequestDto;
import com.euphrosyne.mapper.ReservationMapper;
import com.euphrosyne.service.ReservationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;
    private final ReservationMapper reservationMapper;

    @PostMapping
    public ResponseEntity<ReservationResponseDto> create(@Valid @RequestBody ReservationRequestDto request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(reservationMapper.toResponse(reservationService.create(request)));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ReservationResponseDto>> getAll() {
        return ResponseEntity.ok(reservationMapper.toResponseList(reservationService.findAll()));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ReservationResponseDto> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody StatusUpdateRequestDto request) {
        return ResponseEntity.ok(reservationMapper.toResponse(
                reservationService.updateStatus(id, request.getStatus())));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        reservationService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
