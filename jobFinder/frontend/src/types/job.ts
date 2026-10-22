export interface Job {
  id: number
  title: string
  company: string
  location?: string
  description?: string
  url?: string
  createdAt: string
}

export type JobRequest = Omit<Job, 'id' | 'createdAt'>
