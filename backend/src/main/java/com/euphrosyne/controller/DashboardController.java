package com.euphrosyne.controller;

import com.euphrosyne.model.Reservation;
import com.euphrosyne.service.ContactService;
import com.euphrosyne.service.NewsletterService;
import com.euphrosyne.service.ReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final ReservationService reservationService;
    private final NewsletterService newsletterService;
    private final ContactService contactService;

    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Long>> getStats() {
        return ResponseEntity.ok(Map.of(
                "totalReservations", (long) reservationService.findAll().size(),
                "pendingReservations", reservationService.countByStatus(Reservation.Status.PENDING),
                "confirmedReservations", reservationService.countByStatus(Reservation.Status.CONFIRMED),
                "newsletterSubscribers", newsletterService.countActive(),
                "unreadContacts", contactService.countUnread()
        ));
    }
}
