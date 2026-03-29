import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import AdminLayout from '../../components/AdminLayout'
import {
  adminGetPortfolio,
  adminCreatePortfolioItem,
  adminUpdatePortfolioItem,
  adminTogglePortfolioStatus,
  adminDeletePortfolioItem,
  adminAddPortfolioPhoto,
  adminDeletePortfolioPhoto,
} from '../../services/portfolioService'
import { getPortfolioItem } from '../../services/portfolioService'
import { uploadImage } from '../../services/uploadService'
import { getCategories } from '../../services/categoryService'
import { resolveImageUrl } from '../../utils/imageUrl'
import ConfirmModal from '../../components/ConfirmModal'
import ImageUploadInput from '../../components/ImageUploadInput'
import type { PortfolioItem, PortfolioPhoto, Category } from '../../types'

interface FormData {
  title: string
  location: string
  imageUrl: string
  description: string
  categoryId: number | ''
}

const emptyForm: FormData = { title: '', location: '', imageUrl: '', description: '', categoryId: '' }

export default function PortfolioManager() {
  const [items, setItems] = useState<PortfolioItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState<PortfolioItem | null>(null)
  const [form, setForm] = useState<FormData>(emptyForm)
  const [confirm, setConfirm] = useState<{ open: boolean; id: number }>({ open: false, id: 0 })
  const [saving, setSaving] = useState(false)

  // Album management
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [photos, setPhotos] = useState<Record<number, PortfolioPhoto[]>>({})
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number } | null>(null)
  const photoInputRef = useRef<HTMLInputElement>(null)

  const load = () => {
    Promise.all([adminGetPortfolio(), getCategories('PORTFOLIO')])
      .then(([data, cats]) => { setItems(data); setCategories(cats) })
      .finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const openCreate = () => { setEditItem(null); setForm(emptyForm); setShowForm(true) }
  const openEdit = (item: PortfolioItem) => {
    setEditItem(item)
    setForm({
      title: item.title,
      location: item.location,
      imageUrl: item.imageUrl ?? '',
      description: item.description ?? '',
      categoryId: item.category?.id ?? '',
    })
    setShowForm(true)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const payload = {
      title: form.title,
      location: form.location,
      imageUrl: form.imageUrl,
      description: form.description,
      categoryId: form.categoryId === '' ? null : form.categoryId as number,
      status: editItem?.status ?? 'DRAFT' as const,
    }
    try {
      if (editItem) await adminUpdatePortfolioItem(editItem.id, payload)
      else await adminCreatePortfolioItem(payload)
      setShowForm(false)
      load()
    } finally { setSaving(false) }
  }

  const handleToggleStatus = async (item: PortfolioItem) => {
    const updated = await adminTogglePortfolioStatus(item.id)
    setItems(items.map(i => i.id === updated.id ? updated : i))
  }

  const handleDelete = (id: number) => setConfirm({ open: true, id })

  const doDelete = async () => {
    await adminDeletePortfolioItem(confirm.id)
    setItems(items.filter(i => i.id !== confirm.id))
    setConfirm({ open: false, id: 0 })
  }

  const toggleAlbum = async (item: PortfolioItem) => {
    if (expandedId === item.id) { setExpandedId(null); return }
    setExpandedId(item.id)
    if (!photos[item.id]) {
      const full = await getPortfolioItem(item.id)
      setPhotos(prev => ({ ...prev, [item.id]: full.photos ?? [] }))
    }
  }

  const handlePhotoFiles = async (e: ChangeEvent<HTMLInputElement>, portfolioId: number) => {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    setUploadProgress({ current: 0, total: files.length })
    const added: PortfolioPhoto[] = []
    for (let i = 0; i < files.length; i++) {
      const url = await uploadImage(files[i])
      const photo = await adminAddPortfolioPhoto(portfolioId, url)
      added.push(photo)
      setUploadProgress({ current: i + 1, total: files.length })
    }
    setPhotos(prev => ({ ...prev, [portfolioId]: [...(prev[portfolioId] ?? []), ...added] }))
    setUploadProgress(null)
    if (photoInputRef.current) photoInputRef.current.value = ''
  }

  const handleDeletePhoto = async (portfolioId: number, photoId: number) => {
    await adminDeletePortfolioPhoto(portfolioId, photoId)
    setPhotos(prev => ({ ...prev, [portfolioId]: prev[portfolioId].filter(p => p.id !== photoId) }))
  }

  const handleSetCover = async (item: PortfolioItem, imageUrl: string) => {
    const payload = {
      title: item.title,
      location: item.location,
      imageUrl,
      description: item.description ?? '',
      categoryId: item.category?.id ?? null,
      status: item.status,
    }
    const updated = await adminUpdatePortfolioItem(item.id, payload)
    setItems(items.map(i => i.id === updated.id ? updated : i))
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-headline text-3xl text-on-background">Portfolio</h1>
            <p className="text-on-surface-variant mt-1">{items.length} réalisation(s)</p>
          </div>
          <button onClick={openCreate} className="signature-cta flex items-center gap-2 px-6 py-3 rounded-full text-white font-bold hover:opacity-90 transition-opacity">
            <span className="material-symbols-outlined">add</span>Ajouter
          </button>
        </div>

        {/* Form modal */}
        {showForm && (
          <div className="fixed inset-0 bg-on-background/40 z-50 flex items-center justify-center p-6">
            <div className="bg-surface-container-lowest w-full max-w-lg rounded-xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-headline text-xl text-on-background">
                  {editItem ? 'Modifier' : 'Nouvelle réalisation'}
                </h2>
                <button onClick={() => setShowForm(false)}>
                  <span className="material-symbols-outlined text-on-surface-variant hover:text-on-surface">close</span>
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-label uppercase tracking-wider text-on-surface-variant mb-1 block">
                    Titre <span className="text-primary">*</span>
                  </label>
                  <input
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    required
                    placeholder="ex: Mariage Champêtre Chic"
                    className="w-full px-4 py-3 rounded-lg bg-surface border border-outline-variant/30 focus:ring-2 focus:ring-primary outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="text-sm font-label uppercase tracking-wider text-on-surface-variant mb-1 block">
                    Lieu <span className="text-primary">*</span>
                  </label>
                  <input
                    value={form.location}
                    onChange={e => setForm({ ...form, location: e.target.value })}
                    required
                    placeholder="ex: Provence"
                    className="w-full px-4 py-3 rounded-lg bg-surface border border-outline-variant/30 focus:ring-2 focus:ring-primary outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="text-sm font-label uppercase tracking-wider text-on-surface-variant mb-1 block">Catégorie</label>
                  <select
                    value={form.categoryId}
                    onChange={e => setForm({ ...form, categoryId: e.target.value === '' ? '' : Number(e.target.value) })}
                    className="w-full px-4 py-3 rounded-lg bg-surface border border-outline-variant/30 focus:ring-2 focus:ring-primary outline-none transition-all"
                  >
                    <option value="">— Choisir une catégorie —</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-label uppercase tracking-wider text-on-surface-variant mb-1 block">Photo de couverture</label>
                  <ImageUploadInput value={form.imageUrl} onChange={url => setForm({ ...form, imageUrl: url })} />
                </div>
                <div>
                  <label className="text-sm font-label uppercase tracking-wider text-on-surface-variant mb-1 block">Description</label>
                  <textarea
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg bg-surface border border-outline-variant/30 focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={saving} className="signature-cta flex-1 py-3 rounded-full text-white font-bold hover:opacity-90 disabled:opacity-60">
                    {saving ? 'Enregistrement...' : 'Enregistrer'}
                  </button>
                  <button type="button" onClick={() => setShowForm(false)} className="px-6 py-3 rounded-full border border-outline-variant text-on-surface-variant hover:bg-surface-container transition-all">
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-16"><span className="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span></div>
        ) : (
          <div className="space-y-4">
            {items.map(item => {
              const isPublished = item.status === 'PUBLISHED'
              const isExpanded = expandedId === item.id
              const albumPhotos = photos[item.id] ?? []

              return (
                <div key={item.id} className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm">
                  {/* Item header */}
                  <div className="flex gap-4 p-4">
                    <div className="w-24 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-surface-container">
                      {item.imageUrl ? (
                        <img src={resolveImageUrl(item.imageUrl)} alt={item.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="material-symbols-outlined text-3xl text-outline">image</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-bold text-on-background truncate">{item.title}</h3>
                          <p className="text-sm text-on-surface-variant flex items-center gap-1 mt-0.5">
                            <span className="material-symbols-outlined text-base">location_on</span>{item.location}
                          </p>
                          {item.category && (
                            <span className="text-xs font-label text-on-surface-variant">{item.category.name}</span>
                          )}
                        </div>
                        <button
                          onClick={() => handleToggleStatus(item)}
                          className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-label font-bold transition-all ${
                            isPublished ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                          }`}
                        >
                          {isPublished ? 'Publié' : 'Brouillon'}
                        </button>
                      </div>
                      <div className="flex gap-2 mt-3 flex-wrap">
                        <button onClick={() => openEdit(item)} className="flex items-center gap-1 px-3 py-1.5 bg-surface-container text-on-surface-variant rounded-full text-sm hover:bg-surface-container-high transition-colors">
                          <span className="material-symbols-outlined text-base">edit</span>Modifier
                        </button>
                        <button
                          onClick={() => toggleAlbum(item)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-surface-container text-on-surface-variant rounded-full text-sm hover:bg-surface-container-high transition-colors"
                        >
                          <span className="material-symbols-outlined text-base">photo_library</span>
                          Album {isExpanded ? <span className="material-symbols-outlined text-base">expand_less</span> : <span className="material-symbols-outlined text-base">expand_more</span>}
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="flex items-center gap-1 px-3 py-1.5 bg-error-container/50 text-on-error-container rounded-full text-sm hover:bg-error-container transition-colors">
                          <span className="material-symbols-outlined text-base">delete</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Album section */}
                  {isExpanded && (
                    <div className="border-t border-outline-variant/20 p-4 bg-surface">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-label uppercase tracking-wider text-on-surface-variant">
                          Photos de l'album ({albumPhotos.length})
                        </h4>
                        <div>
                          <input
                            ref={photoInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={e => handlePhotoFiles(e, item.id)}
                          />
                          <button
                            onClick={() => photoInputRef.current?.click()}
                            disabled={uploadProgress !== null}
                            className="flex items-center gap-1 px-3 py-1.5 signature-cta text-white rounded-full text-sm hover:opacity-90 disabled:opacity-60 transition-opacity"
                          >
                            <span className="material-symbols-outlined text-base">add_photo_alternate</span>
                            {uploadProgress
                              ? `${uploadProgress.current} / ${uploadProgress.total} envoyées…`
                              : 'Ajouter des photos'}
                          </button>
                        </div>
                      </div>

                      {albumPhotos.length === 0 ? (
                        <p className="text-sm text-on-surface-variant text-center py-6">Aucune photo dans l'album.</p>
                      ) : (
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                          {albumPhotos.map(photo => {
                            const isCover = item.imageUrl === photo.imageUrl
                            return (
                              <div key={photo.id} className="relative group aspect-square rounded-lg overflow-hidden bg-surface-container">
                                <img
                                  src={resolveImageUrl(photo.imageUrl)}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                                {isCover && (
                                  <div className="absolute top-1 left-1 bg-primary text-white rounded px-1 py-0.5 text-[10px] font-bold leading-none">
                                    Couverture
                                  </div>
                                )}
                                <div className="absolute inset-0 bg-on-background/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                                  {!isCover && (
                                    <button
                                      title="Définir comme couverture"
                                      onClick={() => handleSetCover(item, photo.imageUrl)}
                                      className="p-1 bg-white/90 rounded-full hover:bg-white transition-colors"
                                    >
                                      <span className="material-symbols-outlined text-base text-primary">star</span>
                                    </button>
                                  )}
                                  <button
                                    title="Supprimer"
                                    onClick={() => handleDeletePhoto(item.id, photo.id)}
                                    className="p-1 bg-white/90 rounded-full hover:bg-white transition-colors"
                                  >
                                    <span className="material-symbols-outlined text-base text-error">delete</span>
                                  </button>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      <ConfirmModal
        open={confirm.open}
        title="Supprimer l'item"
        message="Cette action est irréversible."
        onConfirm={doDelete}
        onCancel={() => setConfirm({ open: false, id: 0 })}
      />
    </AdminLayout>
  )
}
