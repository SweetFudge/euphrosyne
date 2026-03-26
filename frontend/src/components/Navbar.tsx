import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const navLinks = [
  { label: 'Accueil', to: '/' },
  { label: 'Histoire', to: '/histoire' },
  { label: 'Catalogue', to: '/catalogue' },
  { label: 'Portfolio', to: '/portfolio' },
  { label: 'Contact', to: '/contact' },
]

export default function Navbar() {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 w-full z-50 bg-stone-50/80 backdrop-blur-xl shadow-sm">
      <div className="max-w-7xl mx-auto px-6 md:px-12 h-20 flex justify-between items-center relative">
        {/* Brand */}
        <Link to="/" className="text-2xl font-headline text-amber-900 tracking-tighter">
          Euphrosyne
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center space-x-8 font-headline italic tracking-tight">
          {navLinks.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              className={
                location.pathname === to
                  ? 'text-amber-800 border-b-2 border-amber-600 pb-1 font-semibold transition-opacity duration-300'
                  : 'text-stone-600 hover:text-amber-700 transition-colors'
              }
            >
              {label}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <Link
          to="/contact"
          className="signature-cta px-8 py-2.5 rounded-full text-white font-semibold tracking-wide hover:opacity-80 transition-opacity duration-300 hidden md:block"
        >
          Nous contacter
        </Link>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-amber-900"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span className="material-symbols-outlined text-3xl">
            {menuOpen ? 'close' : 'menu'}
          </span>
        </button>

        <div className="bg-stone-200/20 h-px w-full bottom-0 absolute left-0" />
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-surface/95 backdrop-blur-xl px-6 pb-6 border-t border-outline-variant/20">
          {navLinks.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className="block py-3 text-on-surface-variant font-headline italic hover:text-primary transition-colors"
            >
              {label}
            </Link>
          ))}
          <Link
            to="/contact"
            onClick={() => setMenuOpen(false)}
            className="signature-cta mt-4 block text-center px-8 py-3 rounded-full text-white font-semibold"
          >
            Nous contacter
          </Link>
        </div>
      )}
    </nav>
  )
}
