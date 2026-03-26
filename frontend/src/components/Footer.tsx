import { Link } from 'react-router-dom'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-stone-100 w-full py-16 border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
        {/* Brand */}
        <div>
          <h3 className="font-headline text-lg text-stone-900 mb-6">Euphrosyne</h3>
          <p className="text-stone-500 text-sm leading-relaxed max-w-xs">
            Organisation d'événements sur mesure — mariages, fêtes privées et anniversaires inoubliables.
          </p>
          <div className="flex gap-4 mt-6 justify-center md:justify-start">
            <span className="material-symbols-outlined text-amber-800 cursor-pointer hover:opacity-70 transition-all">public</span>
            <span className="material-symbols-outlined text-amber-800 cursor-pointer hover:opacity-70 transition-all">share</span>
            <span className="material-symbols-outlined text-amber-800 cursor-pointer hover:opacity-70 transition-all">photo_camera</span>
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="font-sans text-sm tracking-wide uppercase text-amber-800 mb-6">Navigation</h4>
          <ul className="space-y-3 font-sans text-sm tracking-wide uppercase">
            {[
              { label: 'Accueil', to: '/' },
              { label: 'Histoire', to: '/histoire' },
              { label: 'Catalogue', to: '/catalogue' },
              { label: 'Portfolio', to: '/portfolio' },
              { label: 'Contact', to: '/contact' },
            ].map(({ label, to }) => (
              <li key={to}>
                <Link
                  to={to}
                  className="text-stone-500 hover:text-amber-600 underline-offset-4 hover:underline transition-all"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Informations */}
        <div>
          <h4 className="font-sans text-sm tracking-wide uppercase text-amber-800 mb-6">Informations</h4>
          <ul className="space-y-3 font-sans text-sm tracking-wide uppercase">
            {['Mentions Légales', 'Confidentialité', 'FAQ'].map((item) => (
              <li key={item}>
                <a href="#" className="text-stone-500 hover:text-amber-600 underline-offset-4 hover:underline transition-all">
                  {item}
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-xs text-stone-400 uppercase tracking-widest">
            © {year} Euphrosyne. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  )
}
