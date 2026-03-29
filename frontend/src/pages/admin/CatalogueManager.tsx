import { useEffect, useState, type FormEvent } from 'react'
import AdminLayout from '../../components/AdminLayout'
import {
  adminGetCatalogue,
  adminCreateCatalogueItem,
  adminUpdateCatalogueItem,
  adminToggleCatalogueStatus,
  adminDeleteCatalogueItem,
} from '../../services/catalogueService'
import { getCategories } from '../../services/categoryService'
import { getLabels } from '../../services/labelService'
import ImageUploadInput from '../../components/ImageUploadInput'
import { resolveImageUrl } from '../../utils/imageUrl'
import ConfirmModal from '../../components/ConfirmModal'
import type { CatalogueItem, Category, Label } from '../../types'

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

  const load = () => {
    Promise.all([
      adminGetCatalogue(),
      getCategories('CATALOGUE'),
      getLabels(),
    ]).then(([items, cats, lbls]) => {
      setItems(items)
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

  const handleDelete = (id: number) => {
    setConfirm({ open: true, id })
  }

  const doDelete = async () => {
    await adminDeleteCatalogueItem(confirm.id)
    setItems(items.filter(i => i.id !== confirm.id))
    setConfirm({ open: false, id: 0 })
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
                  <label className="text-sm font-label uppercase tracking-wider text-on-surface-variant mb-1 block">Image</label>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map(item => {
              const isPublished = item.status === 'PUBLISHED'
              return (
                <div key={item.id} className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm group">
                  <div className="relative h-48 overflow-hidden">
                    {item.imageUrl ? (
                      <img src={resolveImageUrl(item.imageUrl)} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full bg-surface-container flex items-center justify-center">
                        <span className="material-symbols-outlined text-4xl text-outline">image</span>
                      </div>
                    )}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      {item.category && (
                        <span className="bg-surface-container-lowest/90 px-3 py-1 rounded-full text-xs font-label">{item.category.name}</span>
                      )}
                      <button
                        onClick={() => handleToggleStatus(item)}
                        className={`ml-auto px-3 py-1 rounded-full text-xs font-label font-bold transition-all ${
                          isPublished ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                        }`}
                      >
                        {isPublished ? 'Publié' : 'Brouillon'}
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-on-background">{item.name}</h3>
                    {item.description && <p className="text-sm text-on-surface-variant mt-1 line-clamp-2">{item.description}</p>}
                    {item.labels.length > 0 && (
                      <div className="flex gap-1 flex-wrap mt-2">
                        {item.labels.map(l => (
                          <span key={l.id} className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full font-label">{l.name}</span>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-2 mt-4">
                      <button onClick={() => openEdit(item)} className="flex items-center gap-1 px-4 py-2 bg-surface-container text-on-surface-variant rounded-full text-sm hover:bg-surface-container-high transition-colors">
                        <span className="material-symbols-outlined text-base">edit</span>Modifier
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="flex items-center gap-1 px-4 py-2 bg-error-container/50 text-on-error-container rounded-full text-sm hover:bg-error-container transition-colors">
                        <span className="material-symbols-outlined text-base">delete</span>
                      </button>
                    </div>
                  </div>
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
