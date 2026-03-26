import { useEffect, useState } from 'react'
import AdminLayout from '../../components/AdminLayout'
import { adminGetSubscribers } from '../../services/newsletterService'
import type { NewsletterSubscriber } from '../../types'

export default function NewsletterAdmin() {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminGetSubscribers().then(setSubscribers).finally(() => setLoading(false))
  }, [])

  const active = subscribers.filter(s => s.active).length

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-headline text-3xl text-on-background">Newsletter</h1>
          <p className="text-on-surface-variant mt-1">{active} abonné(s) actif(s) sur {subscribers.length} total</p>
        </div>

        {loading ? (
          <div className="text-center py-16"><span className="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span></div>
        ) : subscribers.length === 0 ? (
          <div className="text-center py-16 text-on-surface-variant">Aucun abonné pour le moment.</div>
        ) : (
          <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-surface-container">
                <tr>
                  {['#', 'Email', "Date d'inscription", 'Statut'].map(h => (
                    <th key={h} className="text-left px-6 py-4 text-sm font-label uppercase tracking-wider text-on-surface-variant">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {subscribers.map((sub, i) => (
                  <tr key={sub.id} className="hover:bg-surface-container/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-on-surface-variant">{i + 1}</td>
                    <td className="px-6 py-4 text-on-surface font-medium">{sub.email}</td>
                    <td className="px-6 py-4 text-sm text-on-surface-variant">
                      {new Date(sub.subscribedAt).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-label ${sub.active ? 'bg-green-100 text-green-800' : 'bg-surface-container text-on-surface-variant'}`}>
                        {sub.active ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
