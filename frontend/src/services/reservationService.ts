import api from './api'
import type { Reservation, ReservationStatus } from '../types'

export const createReservation = (data: Partial<Reservation>): Promise<Reservation> =>
  api.post('/reservations', data).then(r => r.data)

export const adminGetReservations = (): Promise<Reservation[]> =>
  api.get('/reservations').then(r => r.data)

export const adminUpdateReservationStatus = (id: number, status: ReservationStatus): Promise<Reservation> =>
  api.put(`/reservations/${id}/status`, { status }).then(r => r.data)

export const adminDeleteReservation = (id: number): Promise<void> =>
  api.delete(`/reservations/${id}`)
