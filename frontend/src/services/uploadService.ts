import api from './api'

export const uploadImage = (file: File): Promise<string> => {
  const formData = new FormData()
  formData.append('file', file)
  return api.post('/admin/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then(r => r.data.url)
}
