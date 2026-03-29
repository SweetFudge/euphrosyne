import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getPortfolio } from '../services/portfolioService'
import type { PortfolioItem } from '../types'
import { resolveImageUrl } from '../utils/imageUrl'

interface PortfolioGridProps {
  limit?: number
}

export default function PortfolioGrid({ limit }: PortfolioGridProps) {
  const [items, setItems] = useState<PortfolioItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPortfolio()
      .then(data => setItems(limit ? data.slice(0, limit) : data))
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [limit])

  if (loading) {
    return (
      <div className="text-center py-16 text-on-surface-variant">
        <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
      </div>
    )
  }

  const getColSpan = (index: number): string => {
    const pair = Math.floor(index / 2)
    const posInPair = index % 2
    return pair % 2 === 0
      ? posInPair === 0 ? 'md:col-span-8' : 'md:col-span-4'
      : posInPair === 0 ? 'md:col-span-4' : 'md:col-span-8'
  }

  return (
    <section className="py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-xl">
            <span className="text-primary font-label uppercase tracking-[0.2em] text-sm mb-4 block">
              Réalisations
            </span>
            <h2 className="font-headline text-4xl md:text-5xl text-on-background">
              Nos Événements Récents
            </h2>
          </div>
          <Link
            to="/portfolio"
            className="text-primary font-bold border-b-2 border-primary/20 hover:border-primary transition-all pb-1 flex items-center gap-2"
          >
            Voir toutes les réalisations
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:h-[800px]">
            {items.map((item, index) => (
              <div
                key={item.id}
                className={`${getColSpan(index)} group relative overflow-hidden rounded-xl`}
              >
                <img
                  src={resolveImageUrl(item.imageUrl)}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-on-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                  <span className="text-primary-fixed font-label text-xs uppercase tracking-widest mb-2">
                    {item.location}
                  </span>
                  <h3 className="text-white font-headline text-2xl">{item.title}</h3>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-on-surface-variant py-16">Aucune réalisation pour le moment.</p>
        )}
      </div>
    </section>
  )
}
