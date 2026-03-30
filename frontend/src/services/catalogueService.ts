import api from './api'
import type { CatalogueItem, CataloguePhoto } from '../types'

export const getCatalogue = (): Promise<CatalogueItem[]> =>
  api.get('/catalogue').then(r => r.data)

export const getCatalogueItem = (id: number): Promise<CatalogueItem> =>
  api.get(`/catalogue/${id}`).then(r => r.data)

export const adminGetCatalogue = (): Promise<CatalogueItem[]> =>
  api.get('/catalogue/all').then(r => r.data)

export const adminCreateCatalogueItem = (data: {
    name: string;
    imageUrl: string;
    description: string;
    categoryId: null | number;
    labelIds: number[];
    status: "DRAFT" | "PUBLISHED"
}): Promise<CatalogueItem> =>
  api.post('/catalogue', data).then(r => r.data)

export const adminUpdateCatalogueItem = (id: number, data: {
    name: string;
    imageUrl: string;
    description: string;
    categoryId: number | null;
    labelIds: number[];
    status: "DRAFT" | "PUBLISHED"
}): Promise<CatalogueItem> =>
  api.put(`/catalogue/${id}`, data).then(r => r.data)

export const adminToggleCatalogueStatus = (id: number): Promise<CatalogueItem> =>
  api.put(`/catalogue/${id}/status`).then(r => r.data)

export const adminDeleteCatalogueItem = (id: number): Promise<void> =>
  api.delete(`/catalogue/${id}`)

export const adminAddCataloguePhoto = (catalogueId: number, imageUrl: string): Promise<CataloguePhoto> =>
  api.post(`/catalogue/${catalogueId}/photos`, { imageUrl }).then(r => r.data)

export const adminDeleteCataloguePhoto = (catalogueId: number, photoId: number): Promise<void> =>
  api.delete(`/catalogue/${catalogueId}/photos/${photoId}`)