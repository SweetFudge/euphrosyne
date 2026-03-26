import api from './api'
import type { NewsletterSubscriber } from '../types'

export const subscribeNewsletter = (email: string): Promise<NewsletterSubscriber> =>
  api.post('/newsletter/subscribe', { email }).then(r => r.data)

export const adminGetSubscribers = (): Promise<NewsletterSubscriber[]> =>
  api.get('/newsletter').then(r => r.data)
