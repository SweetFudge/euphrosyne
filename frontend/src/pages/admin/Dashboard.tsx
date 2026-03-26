import { useEffect, useState } from 'react'
import AdminLayout from '../../components/AdminLayout'
import api from '../../services/api'
import type { Stats } from '../../types'

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<Stats>('/dashboard/stats')
      .then(r => setStats(r.data))
      .catch(() => setStats(null))
      .finally(() => setLoading(false))
  }, [])

  const statCards = stats ? [
    { icon: 'event_available', label: 'Total Réservations', value: stats.totalReservations, color: 'text-primary' },
    { icon: 'pending', label: 'En attente', value: stats.pendingReservations, color: 'text-amber-600' },
    { icon: 'check_circle', label: 'Confirmées', value: stats.confirmedReservations, color: 'text-green-600' },
    { icon: 'mail', label: 'Abonnés Newsletter', value: stats.newsletterSubscribers, color: 'text-blue-600' },
  ] : []

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="font-headline text-3xl text-on-background">Dashboard</h1>
          <p className="text-on-surface-variant mt-1">Vue d'ensemble de votre activité</p>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <span className="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map(({ icon, label, value, color }) => (
              <div key={label} className="bg-surface-container-lowest p-6 rounded-xl shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <span className={`material-symbols-outlined text-3xl ${color}`}>{icon}</span>
                </div>
                <div className={`text-4xl font-bold ${color} mb-1`}>{value}</div>
                <div className="text-sm text-on-surface-variant font-label">{label}</div>
              </div>
            ))}
          </div>
        )}

        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm">
          <h2 className="font-bold text-on-background text-lg mb-4">Accès rapides</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { to: '/admin/reservations', icon: 'event_available', label: 'Gérer les réservations' },
              { to: '/admin/catalogue', icon: 'category', label: 'Gérer le catalogue' },
              { to: '/admin/portfolio', icon: 'photo_library', label: 'Gérer le portfolio' },
              { to: '/admin/newsletter', icon: 'mail', label: 'Voir les abonnés' },
            ].map(({ to, icon, label }) => (
              <a
                key={to}
                href={to}
                className="flex items-center gap-3 p-4 rounded-lg bg-surface-container hover:bg-surface-container-high transition-all text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-primary">{icon}</span>
                <span className="font-medium">{label}</span>
                <span className="material-symbols-outlined ml-auto text-sm">arrow_forward</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
