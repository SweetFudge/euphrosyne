import api from './api'
import type { Label } from '../types'

export const getLabels = (): Promise<Label[]> =>
  api.get('/labels').then(r => r.data)

export const adminGetAllLabels = (): Promise<Label[]> =>
  api.get('/labels').then(r => r.data)

export const adminCreateLabel = (data: { name: string; description?: string }): Promise<Label> =>
  api.post('/labels', data).then(r => r.data)

export const adminDeleteLabel = (id: number): Promise<void> =>
  api.delete(`/labels/${id}`)
