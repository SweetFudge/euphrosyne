import { createContext, useContext, useState, type ReactNode } from 'react'
import { login as apiLogin, logout as apiLogout } from '../services/authService'

interface AuthContextValue {
  token: string | null
  username: string | null
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'))
  const [username, setUsername] = useState<string | null>(() => localStorage.getItem('username'))

  const login = async (u: string, password: string) => {
    const data = await apiLogin(u, password)
    localStorage.setItem('token', data.token)
    localStorage.setItem('username', data.username)
    setToken(data.token)
    setUsername(data.username)
  }

  const logout = () => {
    apiLogout()
    setToken(null)
    setUsername(null)
  }

  return (
    <AuthContext.Provider value={{ token, username, isAuthenticated: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
