const BASE_URL = '/api'

export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  })
  if (!response.ok) {
    throw new Error(`Erreur API ${response.status}`)
  }
  return response.status === 204 ? (undefined as T) : response.json()
}
