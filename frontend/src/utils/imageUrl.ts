const backendBase = (import.meta.env.VITE_API_URL ?? '/api').replace(/\/api$/, '')

export function resolveImageUrl(url: string | null | undefined): string {
  if (!url) return ''
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  return backendBase + url
}
