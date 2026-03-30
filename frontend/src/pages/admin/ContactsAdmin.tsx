import { useEffect, useState } from 'react'
import AdminLayout from '../../components/AdminLayout'
import ConfirmModal from '../../components/ConfirmModal'
import PageLoader from '../../components/PageLoader'
import {
  adminGetContacts,
  adminMarkContactAsRead,
  adminDeleteContact,
} from '../../services/contactService'
import type { ContactMessage } from '../../types'

export default function ContactsAdmin() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [markReadLoading, setMarkReadLoading] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [confirm, setConfirm] = useState<{ open: boolean; id: number }>({ open: false, id: 0 })

  const load = () => { adminGetContacts().then(setMessages).finally(() => setLoading(false)) }
  useEffect(() => { load() }, [])

  const handleMarkRead = async (id: number) => {
    setMarkReadLoading(id)
    try {
      await adminMarkContactAsRead(id)
      setMessages(messages.map(m => m.id === id ? { ...m, read: true } : m))
    } finally {
      setMarkReadLoading(null)
    }
  }

  const handleDelete = (id: number) => {
    setConfirm({ open: true, id })
  }

  const doDelete = async () => {
    setDeleting(true)
    try {
      await adminDeleteContact(confirm.id)
      setMessages(messages.filter(m => m.id !== confirm.id))
      setConfirm({ open: false, id: 0 })
    } finally {
      setDeleting(false)
    }
  }

  const unreadCount = messages.filter(m => !m.read).length

  return (
    <AdminLayout>
      <PageLoader visible={loading} />
      <div className="space-y-6">
        <div>
          <h1 className="font-headline text-3xl text-on-background">Contacts</h1>
          <p className="text-on-surface-variant mt-1">
            {messages.length} message(s)
            {unreadCount > 0 && (
              <span className="ml-2 bg-primary text-on-primary text-xs px-2 py-0.5 rounded-full font-label">
                {unreadCount} non lu{unreadCount > 1 ? 's' : ''}
              </span>
            )}
          </p>
        </div>

        {!loading && (messages.length === 0 ? (
          <div className="text-center py-16 text-on-surface-variant">Aucun message reçu pour l'instant.</div>
        ) : (
          <div className="space-y-4">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`bg-surface-container-lowest rounded-xl p-6 shadow-sm border-l-4 ${
                  msg.read ? 'border-outline-variant/30' : 'border-primary'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap mb-1">
                      <span className="font-bold text-on-background">
                        {msg.firstName} {msg.lastName}
                      </span>
                      {!msg.read && (
                        <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full font-label">
                          Non lu
                        </span>
                      )}
                      {msg.eventType && (
                        <span className="bg-surface-container text-on-surface-variant text-xs px-2 py-0.5 rounded-full font-label">
                          {msg.eventType}
                        </span>
                      )}
                    </div>
                    <a
                      href={`mailto:${msg.email}`}
                      className="text-sm text-primary hover:underline"
                    >
                      {msg.email}
                    </a>
                    {msg.eventDate && (
                      <p className="text-xs text-on-surface-variant mt-1">
                        <span className="material-symbols-outlined text-xs align-middle">calendar_today</span>{' '}
                        {new Date(msg.eventDate).toLocaleDateString('fr-FR')}
                      </p>
                    )}
                    <p className="text-on-surface-variant mt-3 text-sm leading-relaxed whitespace-pre-wrap">
                      {msg.message}
                    </p>
                    <p className="text-xs text-outline mt-3">
                      Reçu le {new Date(msg.createdAt).toLocaleDateString('fr-FR', {
                        day: 'numeric', month: 'long', year: 'numeric',
                        hour: '2-digit', minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    {!msg.read && (
                      <button
                        onClick={() => handleMarkRead(msg.id)}
                        disabled={markReadLoading !== null}
                        className="flex items-center gap-1 px-3 py-2 bg-surface-container text-on-surface-variant rounded-full text-xs hover:bg-surface-container-high transition-colors disabled:opacity-50"
                        title="Marquer comme lu"
                      >
                        <span className={`material-symbols-outlined text-sm ${markReadLoading === msg.id ? 'animate-spin' : ''}`}>
                          {markReadLoading === msg.id ? 'progress_activity' : 'mark_email_read'}
                        </span>
                        {markReadLoading === msg.id ? 'En cours…' : 'Marquer lu'}
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(msg.id)}
                      disabled={deleting}
                      className="flex items-center gap-1 px-3 py-2 bg-error-container/50 text-on-error-container rounded-full text-xs hover:bg-error-container transition-colors disabled:opacity-50"
                      title="Supprimer"
                    >
                      <span className={`material-symbols-outlined text-sm ${deleting && confirm.id === msg.id ? 'animate-spin' : ''}`}>
                        {deleting && confirm.id === msg.id ? 'progress_activity' : 'delete'}
                      </span>
                      Supprimer
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
        title="Supprimer le message"
        message="Cette action est irréversible."
        loading={deleting}
        onConfirm={doDelete}
        onCancel={() => setConfirm({ open: false, id: 0 })}
      />
    </AdminLayout>
  )
}
