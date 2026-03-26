import api from './api'
import type { AuthResponse } from '../types'

export const login = (username: string, password: string): Promise<AuthResponse> =>
  api.post('/auth/login', { username, password }).then(r => r.data)

export const logout = (): void => {
  localStorage.removeItem('token')
  localStorage.removeItem('username')
}
