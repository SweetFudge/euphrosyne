import api from './api'
import type { PortfolioItem, PortfolioPhoto } from '../types'

export const getPortfolio = (): Promise<PortfolioItem[]> =>
  api.get('/portfolio').then(r => r.data)

export const getPortfolioItem = (id: number): Promise<PortfolioItem> =>
  api.get(`/portfolio/${id}`).then(r => r.data)

export const adminGetPortfolio = (): Promise<PortfolioItem[]> =>
  api.get('/portfolio/all').then(r => r.data)

export const adminCreatePortfolioItem = (data: Omit<PortfolioItem, 'id' | 'createdAt'>): Promise<PortfolioItem> =>
  api.post('/portfolio', data).then(r => r.data)

export const adminUpdatePortfolioItem = (id: number, data: Omit<PortfolioItem, 'id' | 'createdAt'>): Promise<PortfolioItem> =>
  api.put(`/portfolio/${id}`, data).then(r => r.data)

export const adminTogglePortfolioStatus = (id: number): Promise<PortfolioItem> =>
  api.put(`/portfolio/${id}/status`).then(r => r.data)

export const adminDeletePortfolioItem = (id: number): Promise<void> =>
  api.delete(`/portfolio/${id}`)

export const adminAddPortfolioPhoto = (portfolioId: number, imageUrl: string): Promise<PortfolioPhoto> =>
  api.post(`/portfolio/${portfolioId}/photos`, { imageUrl }).then(r => r.data)

export const adminDeletePortfolioPhoto = (portfolioId: number, photoId: number): Promise<void> =>
  api.delete(`/portfolio/${portfolioId}/photos/${photoId}`)
