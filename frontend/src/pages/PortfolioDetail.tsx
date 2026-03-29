import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getPortfolioItem } from '../services/portfolioService'
import type { PortfolioItem } from '../types'
import { resolveImageUrl } from '../utils/imageUrl'

export default function PortfolioDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [item, setItem] = useState<PortfolioItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  useEffect(() => {
    if (!id) return
    getPortfolioItem(Number(id))
      .then(setItem)
      .catch(() => navigate('/portfolio'))
      .finally(() => setLoading(false))
  }, [id, navigate])

  const photos = item?.photos ?? []

  const closeLightbox = useCallback(() => setLightboxIndex(null), [])

  const showPrev = useCallback(() => {
    setLightboxIndex(i => (i !== null ? (i - 1 + photos.length) % photos.length : null))
  }, [photos.length])

  const showNext = useCallback(() => {
    setLightboxIndex(i => (i !== null ? (i + 1) % photos.length : null))
  }, [photos.length])

  useEffect(() => {
    if (lightboxIndex === null) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowLeft') showPrev()
      if (e.key === 'ArrowRight') showNext()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [lightboxIndex, closeLightbox, showPrev, showNext])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
      </div>
    )
  }

  if (!item) return null

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative h-72 md:h-96 overflow-hidden">
        <img
          src={resolveImageUrl(item.imageUrl)}
          alt={item.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-on-background/70 to-transparent" />


        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
          <h1 className="font-headline text-3xl md:text-5xl text-white mb-2">{item.title}</h1>
          <div className="flex items-center gap-4 text-white/80">
            <span className="flex items-center gap-1 text-sm">
              <span className="material-symbols-outlined text-base">location_on</span>
              {item.location}
            </span>
            {item.category && (
              <span className="text-sm px-2 py-0.5 rounded-full bg-white/20">{item.category.name}</span>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      {item.description && (
        <div className="max-w-4xl mx-auto px-6 py-8">
          <p className="font-body text-on-surface-variant leading-relaxed">{item.description}</p>
        </div>
      )}

      {/* Album */}
      <div className="max-w-6xl mx-auto px-6 pb-16">
        {photos.length === 0 ? (
          <div className="text-center py-16 text-on-surface-variant">
            <span className="material-symbols-outlined text-5xl block mb-3">photo_library</span>
            <p className="font-body">Aucune photo disponible pour cet événement.</p>
          </div>
        ) : (
          <div className="relative">
            {/* Back button — absolute left, centered on first photo row, hidden on mobile */}
            <button
              onClick={() => navigate('/portfolio')}
              className="hidden md:inline-flex absolute -left-28 items-center gap-1.5 text-on-surface-variant hover:text-primary transition-colors font-headline italic tracking-tight text-sm"
              style={{ top: '3.5rem' }}
            >
              <span className="material-symbols-outlined text-base not-italic">arrow_back</span>
              Portfolio
            </button>

            <h2 className="font-headline text-2xl text-on-background mb-6">Album photos</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {photos.map((photo, index) => (
                <button
                  key={photo.id}
                  onClick={() => setLightboxIndex(index)}
                  className="aspect-square overflow-hidden rounded-xl focus:outline-none focus:ring-2 focus:ring-primary group"
                >
                  <img
                    src={resolveImageUrl(photo.imageUrl)}
                    alt={`${item.title} — photo ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </button>
              ))}
            </div>

            {/* Back button mobile */}
            <button
              onClick={() => navigate('/portfolio')}
              className="md:hidden mt-6 inline-flex items-center gap-1.5 font-headline italic tracking-tight text-sm text-on-surface-variant hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-base not-italic">arrow_back</span>
              Portfolio
            </button>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Close */}
          <button
            className="absolute top-4 right-4 text-white hover:text-white/70 transition-colors"
            onClick={closeLightbox}
          >
            <span className="material-symbols-outlined text-3xl">close</span>
          </button>

          {/* Counter */}
          <span className="absolute top-4 left-1/2 -translate-x-1/2 text-white/60 text-sm font-label">
            {lightboxIndex + 1} / {photos.length}
          </span>

          {/* Prev */}
          {photos.length > 1 && (
            <button
              className="absolute left-4 text-white hover:text-white/70 transition-colors"
              onClick={e => { e.stopPropagation(); showPrev() }}
            >
              <span className="material-symbols-outlined text-4xl">chevron_left</span>
            </button>
          )}

          {/* Image */}
          <img
            src={resolveImageUrl(photos[lightboxIndex].imageUrl)}
            alt={`${item.title} — photo ${lightboxIndex + 1}`}
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg"
            onClick={e => e.stopPropagation()}
          />

          {/* Next */}
          {photos.length > 1 && (
            <button
              className="absolute right-4 text-white hover:text-white/70 transition-colors"
              onClick={e => { e.stopPropagation(); showNext() }}
            >
              <span className="material-symbols-outlined text-4xl">chevron_right</span>
            </button>
          )}
        </div>
      )}
    </div>
  )
}
