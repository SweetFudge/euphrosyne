import api from './api'
import type { PortfolioItem } from '../types'

export const getPortfolio = (): Promise<PortfolioItem[]> =>
  api.get('/portfolio').then(r => r.data)

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
