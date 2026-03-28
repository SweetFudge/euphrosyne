import api from './api'
import type { NewsletterSubscriber, NewsletterTemplate, NewsletterCampaign } from '../types'

export const subscribeNewsletter = (email: string): Promise<NewsletterSubscriber> =>
  api.post('/newsletter/subscribe', { email }).then(r => r.data)

export const adminGetSubscribers = (): Promise<NewsletterSubscriber[]> =>
  api.get('/newsletter').then(r => r.data)

// Templates
export const adminGetTemplates = (): Promise<NewsletterTemplate[]> =>
  api.get('/newsletter/templates').then(r => r.data)

export const adminCreateTemplate = (data: { name: string; designJson: string; htmlContent: string }): Promise<NewsletterTemplate> =>
  api.post('/newsletter/templates', data).then(r => r.data)

export const adminDeleteTemplate = (id: number): Promise<void> =>
  api.delete(`/newsletter/templates/${id}`)

// Campagnes
export const adminGetCampaigns = (): Promise<NewsletterCampaign[]> =>
  api.get('/newsletter/campaigns').then(r => r.data)

export const adminSendCampaign = (data: { subject: string; htmlContent: string; designJson: string }): Promise<NewsletterCampaign> =>
  api.post('/newsletter/campaigns/send', data).then(r => r.data)
