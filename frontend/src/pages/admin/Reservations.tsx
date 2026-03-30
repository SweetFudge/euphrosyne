import { useEffect, useState } from 'react'
import AdminLayout from '../../components/AdminLayout'
import ConfirmModal from '../../components/ConfirmModal'
import PageLoader from '../../components/PageLoader'
import {
  adminGetReservations,
  adminUpdateReservationStatus,
  adminDeleteReservation,
} from '../../services/reservationService'
import type { Reservation, ReservationStatus } from '../../types'

const STATUS_LABELS: Record<ReservationStatus, { label: string; color: string }> = {
  PENDING: { label: 'En attente', color: 'bg-amber-100 text-amber-800' },
  CONFIRMED: { label: 'Confirmée', color: 'bg-green-100 text-green-800' },
  REJECTED: { label: 'Refusée', color: 'bg-red-100 text-red-800' },
}

const EVENT_LABELS: Record<string, string> = {
  MARIAGE: 'Mariage',
  FETE_PRIVEE: 'Fête Privée',
  ANNIVERSAIRE: 'Anniversaire',
}

type Filter = 'ALL' | ReservationStatus

export default function Reservations() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<Filter>('ALL')
  const [statusLoading, setStatusLoading] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [confirm, setConfirm] = useState<{ open: boolean; id: number }>({ open: false, id: 0 })

  const load = () => {
    adminGetReservations()
      .then(setReservations)
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleStatus = async (id: number, status: ReservationStatus) => {
    setStatusLoading(id)
    try {
      await adminUpdateReservationStatus(id, status)
      load()
    } finally {
      setStatusLoading(null)
    }
  }

  const handleDelete = (id: number) => {
    setConfirm({ open: true, id })
  }

  const doDelete = async () => {
    setDeleting(true)
    try {
      await adminDeleteReservation(confirm.id)
      setConfirm({ open: false, id: 0 })
      load()
    } finally {
      setDeleting(false)
    }
  }

  const filtered = filter === 'ALL' ? reservations : reservations.filter(r => r.status === filter)

  return (
    <AdminLayout>
      <PageLoader visible={loading} />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-headline text-3xl text-on-background">Réservations</h1>
            <p className="text-on-surface-variant mt-1">{reservations.length} demande(s) au total</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {(['ALL', 'PENDING', 'CONFIRMED', 'REJECTED'] as Filter[]).map(s => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-4 py-2 rounded-full text-sm font-label transition-all ${
                  filter === s ? 'signature-cta text-white' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                {s === 'ALL' ? 'Toutes' : STATUS_LABELS[s as ReservationStatus].label}
              </button>
            ))}
          </div>
        </div>

        {!loading && (filtered.length === 0 ? (
          <div className="text-center py-16 text-on-surface-variant">Aucune réservation.</div>
        ) : (
          <div className="space-y-4">
            {filtered.map(r => (
              <div key={r.id} className="bg-surface-container-lowest p-6 rounded-xl shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-bold text-on-background text-lg">{r.firstName} {r.lastName}</h3>
                      <span className={`px-3 py-0.5 rounded-full text-xs font-label ${STATUS_LABELS[r.status].color}`}>
                        {STATUS_LABELS[r.status].label}
                      </span>
                      <span className="bg-surface-container px-3 py-0.5 rounded-full text-xs font-label text-on-surface-variant">
                        {EVENT_LABELS[r.eventType] ?? r.eventType}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 text-sm text-on-surface-variant">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-base">mail</span>
                        {r.email}
                      </span>
                      {r.phone && (
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-base">call</span>
                          {r.phone}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-base">calendar_today</span>
                        {new Date(r.eventDate).toLocaleDateString('fr-FR')}
                      </span>
                      {r.guestCount && (
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-base">group</span>
                          {r.guestCount} invités
                        </span>
                      )}
                    </div>
                    {r.message && (
                      <p className="mt-3 text-sm text-on-surface-variant italic border-l-2 border-outline-variant pl-3">
                        "{r.message}"
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    {r.status !== 'CONFIRMED' && (
                      <button
                        onClick={() => handleStatus(r.id, 'CONFIRMED')}
                        disabled={statusLoading !== null}
                        className="flex items-center gap-1 px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm hover:bg-green-200 transition-colors disabled:opacity-50"
                      >
                        <span className={`material-symbols-outlined text-base ${statusLoading === r.id ? 'animate-spin' : ''}`}>
                          {statusLoading === r.id ? 'progress_activity' : 'check'}
                        </span>
                        Confirmer
                      </button>
                    )}
                    {r.status !== 'REJECTED' && (
                      <button
                        onClick={() => handleStatus(r.id, 'REJECTED')}
                        disabled={statusLoading !== null}
                        className="flex items-center gap-1 px-4 py-2 bg-red-100 text-red-800 rounded-full text-sm hover:bg-red-200 transition-colors disabled:opacity-50"
                      >
                        <span className={`material-symbols-outlined text-base ${statusLoading === r.id ? 'animate-spin' : ''}`}>
                          {statusLoading === r.id ? 'progress_activity' : 'close'}
                        </span>
                        Refuser
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(r.id)}
                      disabled={deleting || statusLoading !== null}
                      className="flex items-center gap-1 px-4 py-2 bg-surface-container text-on-surface-variant rounded-full text-sm hover:bg-error-container hover:text-on-error-container transition-colors disabled:opacity-50"
                    >
                      <span className={`material-symbols-outlined text-base ${deleting && confirm.id === r.id ? 'animate-spin' : ''}`}>
                        {deleting && confirm.id === r.id ? 'progress_activity' : 'delete'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <ConfirmModal
        open={confirm.open}
        title="Supprimer la réservation"
        message="Cette action est irréversible."
        loading={deleting}
        onConfirm={doDelete}
        onCancel={() => setConfirm({ open: false, id: 0 })}
      />
    </AdminLayout>
  )
}
