package com.euphrosyne.repository;

import com.euphrosyne.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findAllByOrderByCreatedAtDesc();
    long countByStatus(Reservation.Status status);
}
