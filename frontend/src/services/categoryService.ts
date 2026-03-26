import api from './api'
import type { Category, CategoryScope } from '../types'

export const getCategories = (scope: CategoryScope): Promise<Category[]> =>
  api.get('/categories', { params: { scope } }).then(r => r.data)

export const adminGetAllCategories = (): Promise<Category[]> =>
  api.get('/categories/all').then(r => r.data)

export const adminCreateCategory = (data: { name: string; scope: CategoryScope; description?: string }): Promise<Category> =>
  api.post('/categories', data).then(r => r.data)

export const adminDeleteCategory = (id: number): Promise<void> =>
  api.delete(`/categories/${id}`)
