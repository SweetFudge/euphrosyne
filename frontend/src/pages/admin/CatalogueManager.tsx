import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import AdminLayout from '../../components/AdminLayout'
import {
  adminGetCatalogue,
  adminCreateCatalogueItem,
  adminUpdateCatalogueItem,
  adminToggleCatalogueStatus,
  adminDeleteCatalogueItem,
  getCatalogueItem,
  adminAddCataloguePhoto,
  adminDeleteCataloguePhoto,
} from '../../services/catalogueService'
import { getCategories } from '../../services/categoryService'
import { getLabels } from '../../services/labelService'
import { uploadImage } from '../../services/uploadService'
import ImageUploadInput from '../../components/ImageUploadInput'
import { resolveImageUrl } from '../../utils/imageUrl'
import ConfirmModal from '../../components/ConfirmModal'
import type { CatalogueItem, CataloguePhoto, Category, Label } from '../../types'

interface FormData {
  name: string
  imageUrl: string
  description: string
  categoryId: number | ''
  labelIds: number[]
}

const emptyForm: FormData = { name: '', imageUrl: '', description: '', categoryId: '', labelIds: [] }

export default function CatalogueManager() {
  const [items, setItems] = useState<CatalogueItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [labels, setLabels] = useState<Label[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState<CatalogueItem | null>(null)
  const [form, setForm] = useState<FormData>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [confirm, setConfirm] = useState<{ open: boolean; id: number }>({ open: false, id: 0 })

  // Album management
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [photos, setPhotos] = useState<Record<number, CataloguePhoto[]>>({})
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number } | null>(null)
  const [coverLoading, setCoverLoading] = useState<number | null>(null)
  const photoInputRef = useRef<HTMLInputElement>(null)

  const load = () => {
    Promise.all([
      adminGetCatalogue(),
      getCategories('CATALOGUE'),
      getLabels(),
    ]).then(([data, cats, lbls]) => {
      setItems(data)
      setCategories(cats)
      setLabels(lbls)
    }).finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const openCreate = () => { setEditItem(null); setForm(emptyForm); setShowForm(true) }
  const openEdit = (item: CatalogueItem) => {
    setEditItem(item)
    setForm({
      name: item.name,
      imageUrl: item.imageUrl ?? '',
      description: item.description ?? '',
      categoryId: item.category?.id ?? '',
      labelIds: item.labels.map(l => l.id),
    })
    setShowForm(true)
  }

  const toggleLabel = (id: number) => {
    setForm(f => ({
      ...f,
      labelIds: f.labelIds.includes(id) ? f.labelIds.filter(x => x !== id) : [...f.labelIds, id],
    }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const payload = {
      name: form.name,
      imageUrl: form.imageUrl,
      description: form.description,
      categoryId: form.categoryId === '' ? null : form.categoryId as number,
      labelIds: form.labelIds,
      status: editItem?.status ?? 'DRAFT' as const,
    }
    try {
      if (editItem) await adminUpdateCatalogueItem(editItem.id, payload)
      else await adminCreateCatalogueItem(payload)
      setShowForm(false)
      load()
    } finally { setSaving(false) }
  }

  const handleToggleStatus = async (item: CatalogueItem) => {
    const updated = await adminToggleCatalogueStatus(item.id)
    setItems(items.map(i => i.id === updated.id ? updated : i))
  }

  const handleDelete = (id: number) => setConfirm({ open: true, id })

  const doDelete = async () => {
    await adminDeleteCatalogueItem(confirm.id)
    setItems(items.filter(i => i.id !== confirm.id))
    setConfirm({ open: false, id: 0 })
  }

  const toggleAlbum = async (item: CatalogueItem) => {
    if (expandedId === item.id) { setExpandedId(null); return }
    setExpandedId(item.id)
    if (!photos[item.id]) {
      const full = await getCatalogueItem(item.id)
      setPhotos(prev => ({ ...prev, [item.id]: full.photos ?? [] }))
    }
  }

  const handlePhotoFiles = async (e: ChangeEvent<HTMLInputElement>, catalogueId: number) => {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    setUploadProgress({ current: 0, total: files.length })
    const added: CataloguePhoto[] = []
    for (let i = 0; i < files.length; i++) {
      const url = await uploadImage(files[i])
      const photo = await adminAddCataloguePhoto(catalogueId, url)
      added.push(photo)
      setUploadProgress({ current: i + 1, total: files.length })
    }
    setPhotos(prev => ({ ...prev, [catalogueId]: [...(prev[catalogueId] ?? []), ...added] }))
    setUploadProgress(null)
    if (photoInputRef.current) photoInputRef.current.value = ''
  }

  const handleDeletePhoto = async (catalogueId: number, photoId: number) => {
    await adminDeleteCataloguePhoto(catalogueId, photoId)
    setPhotos(prev => ({ ...prev, [catalogueId]: prev[catalogueId].filter(p => p.id !== photoId) }))
  }

  const handleSetCover = async (item: CatalogueItem, photo: CataloguePhoto) => {
    setCoverLoading(photo.id)
    const payload = {
      name: item.name,
      imageUrl: photo.imageUrl,
      description: item.description ?? '',
      categoryId: item.category?.id ?? null,
      labelIds: item.labels.map(l => l.id),
      status: item.status,
    }
    try {
      const updated = await adminUpdateCatalogueItem(item.id, payload)
      setItems(items.map(i => i.id === updated.id ? updated : i))
    } finally {
      setCoverLoading(null)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-headline text-3xl text-on-background">Catalogue</h1>
            <p className="text-on-surface-variant mt-1">{items.length} article(s)</p>
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
                  {editItem ? 'Modifier l\'article' : 'Nouvel article'}
                </h2>
                <button onClick={() => setShowForm(false)}>
                  <span className="material-symbols-outlined text-on-surface-variant hover:text-on-surface">close</span>
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-label uppercase tracking-wider text-on-surface-variant mb-1 block">
                    Nom <span className="text-primary">*</span>
                  </label>
                  <input
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    required
                    placeholder="ex: Arche en bois flotté"
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

                {labels.length > 0 && (
                  <div>
                    <label className="text-sm font-label uppercase tracking-wider text-on-surface-variant mb-2 block">Compatible avec</label>
                    <div className="flex gap-3 flex-wrap">
                      {labels.map(label => (
                        <button
                          key={label.id}
                          type="button"
                          onClick={() => toggleLabel(label.id)}
                          className={`px-4 py-2 rounded-full text-sm font-label border-2 transition-all ${
                            form.labelIds.includes(label.id)
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-outline-variant/30 text-on-surface-variant hover:border-primary/30'
                          }`}
                        >
                          {label.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-sm font-label uppercase tracking-wider text-on-surface-variant mb-1 block">Image de couverture</label>
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
        ) : items.length === 0 ? (
          <div className="text-center py-16 text-on-surface-variant">Aucun article. Ajoutez-en un pour commencer.</div>
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
                        <img src={resolveImageUrl(item.imageUrl)} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="material-symbols-outlined text-3xl text-outline">image</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-bold text-on-background truncate">{item.name}</h3>
                          {item.category && (
                            <span className="text-xs font-label text-on-surface-variant">{item.category.name}</span>
                          )}
                          {item.labels.length > 0 && (
                            <div className="flex gap-1 flex-wrap mt-1">
                              {item.labels.map(l => (
                                <span key={l.id} className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full font-label">{l.name}</span>
                              ))}
                            </div>
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
                                {/* Voile de chargement couverture */}
                                {coverLoading === photo.id && (
                                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                    <span className="material-symbols-outlined animate-spin text-white text-2xl">progress_activity</span>
                                  </div>
                                )}
                                <div className="absolute inset-0 bg-on-background/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                                  {!isCover && (
                                    <button
                                      title="Définir comme couverture"
                                      onClick={() => handleSetCover(item, photo)}
                                      disabled={coverLoading !== null}
                                      className="p-1 bg-white/90 rounded-full hover:bg-white transition-colors disabled:opacity-50"
                                    >
                                      <span className="material-symbols-outlined text-base text-primary">star</span>
                                    </button>
                                  )}
                                  <button
                                    title="Supprimer"
                                    onClick={() => handleDeletePhoto(item.id, photo.id)}
                                    disabled={coverLoading !== null}
                                    className="p-1 bg-white/90 rounded-full hover:bg-white transition-colors disabled:opacity-50"
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
        title="Supprimer l'article"
        message="Cette action est irréversible."
        onConfirm={doDelete}
        onCancel={() => setConfirm({ open: false, id: 0 })}
      />
    </AdminLayout>
  )
}