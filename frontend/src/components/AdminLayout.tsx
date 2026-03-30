import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'
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
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  const closeSidebar = () => setSidebarOpen(false)

  const sidebarContent = (
    <>
      <div className="p-6 border-b border-outline-variant/20 flex items-center justify-between">
        <div>
          <Link to="/" className="font-headline text-lg text-amber-900 tracking-tighter block" onClick={closeSidebar}>
            Euphrosyne
          </Link>
          <p className="text-on-surface-variant text-xs mt-1 font-label uppercase tracking-widest">Administration</p>
        </div>
        <button
          onClick={closeSidebar}
          className="md:hidden p-1 rounded-lg text-on-surface-variant hover:bg-surface-container"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ to, icon, label }) => (
          <Link
            key={to}
            to={to}
            onClick={closeSidebar}
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
    </>
  )

  return (
    <div className="min-h-screen bg-surface-container-low flex">
      {/* Sidebar desktop */}
      <aside className="hidden md:flex w-64 bg-surface-container-lowest shadow-sm flex-col shrink-0">
        {sidebarContent}
      </aside>

      {/* Sidebar mobile — overlay drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={closeSidebar}
          />
          <aside className="relative z-50 w-64 bg-surface-container-lowest shadow-lg flex flex-col">
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar mobile */}
        <header className="md:hidden flex items-center gap-3 px-4 py-3 bg-surface-container-lowest border-b border-outline-variant/20 shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1 rounded-lg text-on-surface-variant hover:bg-surface-container"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
          <span className="font-headline text-base text-amber-900 tracking-tighter">Euphrosyne</span>
          <span className="text-on-surface-variant text-xs font-label uppercase tracking-widest">— Admin</span>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
