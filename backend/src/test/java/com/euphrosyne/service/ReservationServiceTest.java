package com.euphrosyne.service;

import com.euphrosyne.dto.ReservationRequestDto;
import com.euphrosyne.model.Reservation;
import com.euphrosyne.repository.ReservationRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReservationServiceTest {

    @Mock
    private ReservationRepository reservationRepository;

    @InjectMocks
    private ReservationService reservationService;

    @Test
    void shouldCreateReservation_whenValidRequest() {
        // given
        ReservationRequestDto dto = new ReservationRequestDto();
        dto.setFirstName("Marie");
        dto.setLastName("Dupont");
        dto.setEmail("marie@example.com");
        dto.setPhone("0600000000");
        dto.setEventType(Reservation.EventType.MARIAGE);
        dto.setEventDate(LocalDate.now().plusMonths(3));
        dto.setGuestCount(100);
        dto.setBudget(new BigDecimal("5000"));
        dto.setMessage("Merci");

        Reservation saved = Reservation.builder()
                .id(1L).firstName("Marie").lastName("Dupont").email("marie@example.com")
                .eventType(Reservation.EventType.MARIAGE).eventDate(dto.getEventDate())
                .build();
        when(reservationRepository.save(any(Reservation.class))).thenReturn(saved);

        // when
        Reservation result = reservationService.create(dto);

        // then
        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getFirstName()).isEqualTo("Marie");
        verify(reservationRepository).save(any(Reservation.class));
    }

    @Test
    void shouldReturnAllReservations_orderedByDate() {
        // given
        List<Reservation> reservations = List.of(
                Reservation.builder().id(1L).build(),
                Reservation.builder().id(2L).build()
        );
        when(reservationRepository.findAllByOrderByCreatedAtDesc()).thenReturn(reservations);

        // when
        List<Reservation> result = reservationService.findAll();

        // then
        assertThat(result).hasSize(2);
    }

    @Test
    void shouldUpdateStatus_whenReservationExists() {
        // given
        Reservation reservation = Reservation.builder().id(1L).status(Reservation.Status.PENDING).build();
        when(reservationRepository.findById(1L)).thenReturn(Optional.of(reservation));
        when(reservationRepository.save(any(Reservation.class))).thenReturn(reservation);

        // when
        Reservation result = reservationService.updateStatus(1L, Reservation.Status.CONFIRMED);

        // then
        assertThat(result.getStatus()).isEqualTo(Reservation.Status.CONFIRMED);
    }

    @Test
    void shouldThrowException_whenUpdatingStatusOfNonExistentReservation() {
        // given
        when(reservationRepository.findById(99L)).thenReturn(Optional.empty());

        // when / then
        assertThatThrownBy(() -> reservationService.updateStatus(99L, Reservation.Status.CONFIRMED))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("99");
    }

    @Test
    void shouldDeleteReservation_whenIdExists() {
        // when
        reservationService.delete(1L);

        // then
        verify(reservationRepository).deleteById(1L);
    }

    @Test
    void shouldReturnCount_byStatus() {
        // given
        when(reservationRepository.countByStatus(Reservation.Status.PENDING)).thenReturn(3L);

        // when
        long count = reservationService.countByStatus(Reservation.Status.PENDING);

        // then
        assertThat(count).isEqualTo(3L);
    }
}
