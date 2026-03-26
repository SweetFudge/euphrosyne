import api from './api'
import type { ContactMessage, ContactFormData } from '../types'

export const createContact = (data: ContactFormData): Promise<ContactMessage> =>
  api.post('/contacts', data).then(r => r.data)

export const adminGetContacts = (): Promise<ContactMessage[]> =>
  api.get('/contacts').then(r => r.data)

export const adminMarkContactAsRead = (id: number): Promise<ContactMessage> =>
  api.put(`/contacts/${id}/read`).then(r => r.data)

export const adminDeleteContact = (id: number): Promise<void> =>
  api.delete(`/contacts/${id}`)
