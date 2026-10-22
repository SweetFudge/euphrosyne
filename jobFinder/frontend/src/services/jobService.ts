import type { Job, JobRequest } from '../types/job'
import { request } from './api'

export const jobService = {
  search: (query?: string) =>
    request<Job[]>(query ? `/jobs?q=${encodeURIComponent(query)}` : '/jobs'),
  get: (id: number) => request<Job>(`/jobs/${id}`),
  create: (job: JobRequest) =>
    request<Job>('/jobs', { method: 'POST', body: JSON.stringify(job) }),
  remove: (id: number) => request<void>(`/jobs/${id}`, { method: 'DELETE' }),
}
