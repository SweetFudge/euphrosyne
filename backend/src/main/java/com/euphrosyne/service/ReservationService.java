package com.euphrosyne.service;

import com.euphrosyne.dto.ReservationRequestDto;
import com.euphrosyne.model.Reservation;
import com.euphrosyne.exception.ResourceNotFoundException;
import com.euphrosyne.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;

    public Reservation create(ReservationRequestDto request) {
        Reservation reservation = Reservation.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .eventType(request.getEventType())
                .eventDate(request.getEventDate())
                .guestCount(request.getGuestCount())
                .budget(request.getBudget())
                .message(request.getMessage())
                .build();
        return reservationRepository.save(reservation);
    }

    public List<Reservation> findAll() {
        return reservationRepository.findAllByOrderByCreatedAtDesc();
    }

    public Reservation updateStatus(Long id, Reservation.Status status) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Réservation non trouvée : " + id));
        reservation.setStatus(status);
        return reservationRepository.save(reservation);
    }

    public void delete(Long id) {
        reservationRepository.deleteById(id);
    }

    public long countByStatus(Reservation.Status status) {
        return reservationRepository.countByStatus(status);
    }
}
