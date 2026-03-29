import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPortfolio } from '../services/portfolioService'
import type { PortfolioItem } from '../types'
import { resolveImageUrl } from '../utils/imageUrl'

export default function PortfolioPage() {
  const navigate = useNavigate()
  const [items, setItems] = useState<PortfolioItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string | null>(null)

  useEffect(() => {
    getPortfolio()
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [])

  // Build category list dynamically from loaded items
  const categories = Array.from(
    new Map(
      items
        .filter(i => i.category !== null)
        .map(i => [i.category!.id, i.category!])
    ).values()
  ).sort((a, b) => a.name.localeCompare(b.name))

  const filtered = filter === null
    ? items
    : items.filter(item => item.category?.id === Number(filter))

  return (
    <div className="pt-20">

      {/* Hero */}
      <section className="relative py-28 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=80"
            alt="Portfolio Euphrosyne"
            className="w-full h-full object-cover brightness-[0.35]"
          />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-12 text-center">
          <span className="text-primary-fixed font-label uppercase tracking-[0.2em] text-sm mb-6 block">
            Nos réalisations
          </span>
          <h1 className="font-headline text-5xl md:text-7xl text-white mb-8 leading-tight">
            Portfolio
          </h1>
          <p className="text-white/80 text-xl font-light max-w-xl mx-auto">
            Mariages, anniversaires, fêtes privées — chaque événement est une œuvre unique que nous sommes fiers de partager.
          </p>
        </div>
      </section>

      {/* Filtres */}
      <section className="bg-surface sticky top-20 z-40 border-b border-outline-variant/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-4">
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setFilter(null)}
              className={`px-5 py-2 rounded-full text-sm font-label transition-all ${
                filter === null
                  ? 'signature-cta text-white shadow'
                  : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              Tous
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setFilter(String(cat.id))}
                className={`px-5 py-2 rounded-full text-sm font-label transition-all ${
                  filter === String(cat.id)
                    ? 'signature-cta text-white shadow'
                    : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-16 bg-surface">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {loading ? (
            <div className="text-center py-24">
              <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24">
              <span className="material-symbols-outlined text-5xl text-outline mb-4 block">photo_library</span>
              <p className="text-on-surface-variant text-lg">Aucune réalisation dans cette catégorie pour le moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(item => (
                <div key={item.id} onClick={() => navigate(`/portfolio/${item.id}`)} className="cursor-pointer group relative aspect-[4/3] overflow-hidden rounded-2xl shadow-sm">
                  <img
                    src={resolveImageUrl(item.imageUrl)}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-on-background/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                    {item.category && (
                      <span className="text-primary-fixed font-label text-xs uppercase tracking-widest mb-2">
                        {item.category.name}
                      </span>
                    )}
                    <h3 className="text-white font-headline text-xl mb-1">{item.title}</h3>
                    {item.location && (
                      <p className="text-white/70 text-sm flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">location_on</span>
                        {item.location}
                      </p>
                    )}
                    {item.description && (
                      <p className="text-white/80 text-sm mt-2 line-clamp-2">{item.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
