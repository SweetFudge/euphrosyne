import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { ReactNode } from 'react'

const navItems = [
  { to: '/admin/dashboard', icon: 'dashboard', label: 'Dashboard' },
  { to: '/admin/contacts', icon: 'mark_email_unread', label: 'Contacts' },
  { to: '/admin/reservations', icon: 'event_available', label: 'Réservations' },
  { to: '/admin/catalogue', icon: 'category', label: 'Catalogue' },
  { to: '/admin/portfolio', icon: 'photo_library', label: 'Portfolio' },
  { to: '/admin/newsletter', icon: 'mail', label: 'Newsletter' },
  { to: '/admin/labels', icon: 'label', label: 'Étiquettes' },
]

export default function AdminLayout({ children }: { children: ReactNode }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { username, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-surface-container-low flex">
      {/* Sidebar */}
      <aside className="w-64 bg-surface-container-lowest shadow-sm flex flex-col">
        <div className="p-6 border-b border-outline-variant/20">
          <Link to="/" className="font-headline text-lg text-amber-900 tracking-tighter block">
            Euphrosyne
          </Link>
          <p className="text-on-surface-variant text-xs mt-1 font-label uppercase tracking-widest">Administration</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ to, icon, label }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                location.pathname === to
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-xl">{icon}</span>
              {label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-outline-variant/20">
          <div className="flex items-center gap-3 mb-3 px-4">
            <span className="material-symbols-outlined text-primary">account_circle</span>
            <span className="text-sm text-on-surface-variant">{username}</span>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-on-surface-variant hover:bg-error-container hover:text-on-error-container transition-all"
          >
            <span className="material-symbols-outlined text-xl">logout</span>
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  )
}
