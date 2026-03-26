import api from './api'
import type { CatalogueItem } from '../types'

export const getCatalogue = (): Promise<CatalogueItem[]> =>
  api.get('/catalogue').then(r => r.data)

export const adminGetCatalogue = (): Promise<CatalogueItem[]> =>
  api.get('/catalogue/all').then(r => r.data)

export const adminCreateCatalogueItem = (data: Omit<CatalogueItem, 'id'>): Promise<CatalogueItem> =>
  api.post('/catalogue', data).then(r => r.data)

export const adminUpdateCatalogueItem = (id: number, data: Omit<CatalogueItem, 'id'>): Promise<CatalogueItem> =>
  api.put(`/catalogue/${id}`, data).then(r => r.data)

export const adminToggleCatalogueStatus = (id: number): Promise<CatalogueItem> =>
  api.put(`/catalogue/${id}/status`).then(r => r.data)

export const adminDeleteCatalogueItem = (id: number): Promise<void> =>
  api.delete(`/catalogue/${id}`)
