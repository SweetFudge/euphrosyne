import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getCatalogue } from '../services/catalogueService'
import type { CatalogueItem } from '../types'

const EVENT_BADGE_COLORS: Record<string, string> = {
  'Mariage': 'bg-amber-100 text-amber-800',
  'Fête Privée': 'bg-purple-100 text-purple-800',
  'Anniversaire': 'bg-rose-100 text-rose-800',
}

export default function Catalogue() {
  const [items, setItems] = useState<CatalogueItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  useEffect(() => {
    getCatalogue()
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [])

  // Build category list dynamically from items
  const categories = Array.from(
    new Map(
      items
        .filter(i => i.category !== null)
        .map(i => [i.category!.id, i.category!])
    ).values()
  ).sort((a, b) => a.name.localeCompare(b.name))

  const filtered = selectedCategory === null
    ? items
    : items.filter(item => item.category?.id === Number(selectedCategory))

  return (
    <div className="pt-20">

      {/* Hero */}
      <section className="py-24 bg-surface-container-low">
        <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
          <span className="text-primary font-label uppercase tracking-[0.2em] text-sm mb-4 block">
            Notre matériel
          </span>
          <h1 className="font-headline text-5xl md:text-6xl text-on-background mb-6 leading-tight">
            Le Catalogue
          </h1>
          <p className="text-on-surface-variant text-xl font-light leading-relaxed max-w-2xl mx-auto">
            Découvrez notre sélection d'éléments décoratifs disponibles à la location — arches, fleurs, nappes, centres de table — pour sublimer chaque événement.
          </p>
        </div>
      </section>

      {/* Catalogue */}
      <section className="py-16 bg-surface">
        <div className="max-w-7xl mx-auto px-6 md:px-12">

          {/* Filtres catégories */}
          {!loading && categories.length > 0 && (
            <div className="flex flex-wrap gap-3 justify-center mb-12">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-6 py-2.5 rounded-full text-sm font-label transition-all ${
                  selectedCategory === null
                    ? 'signature-cta text-white shadow-md'
                    : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                Tous
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(String(cat.id))}
                  className={`px-6 py-2.5 rounded-full text-sm font-label transition-all ${
                    selectedCategory === String(cat.id)
                      ? 'signature-cta text-white shadow-md'
                      : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <div className="text-center py-24">
              <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24">
              <span className="material-symbols-outlined text-5xl text-outline mb-4 block">inventory_2</span>
              <p className="text-on-surface-variant text-lg">Aucun article dans cette catégorie pour le moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map(item => (
                <div key={item.id} className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow group">
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-surface-container flex items-center justify-center">
                        <span className="material-symbols-outlined text-5xl text-outline">image</span>
                      </div>
                    )}
                    {item.category && (
                      <span className="absolute top-3 left-3 bg-surface-container-lowest/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-label text-on-surface">
                        {item.category.name}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="font-headline text-xl text-on-background mb-2">{item.name}</h3>
                    {item.description && (
                      <p className="text-on-surface-variant text-sm leading-relaxed mb-4 line-clamp-2">
                        {item.description}
                      </p>
                    )}

                    {/* Label badges */}
                    {item.labels.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {item.labels.map(label => {
                          const color = EVENT_BADGE_COLORS[label.name] ?? 'bg-surface-container text-on-surface-variant'
                          return (
                            <span key={label.id} className={`px-2.5 py-0.5 rounded-full text-xs font-label ${color}`}>
                              {label.name}
                            </span>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-surface-container-low text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="font-headline text-3xl text-on-background mb-4">
            Un article vous intéresse ?
          </h2>
          <p className="text-on-surface-variant mb-8">
            Contactez-nous pour vérifier la disponibilité et obtenir un devis personnalisé.
          </p>
          <Link
            to="/contact"
            className="signature-cta inline-flex items-center gap-2 px-10 py-4 rounded-full text-white font-bold text-lg hover:opacity-90 transition-opacity"
          >
            <span className="material-symbols-outlined">mail</span>
            Demander un devis
          </Link>
        </div>
      </section>
    </div>
  )
}
