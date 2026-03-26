import { useEffect, useState, type FormEvent } from 'react'
import AdminLayout from '../../components/AdminLayout'
import {
  adminGetAllCategories,
  adminCreateCategory,
  adminDeleteCategory,
} from '../../services/categoryService'
import {
  adminGetAllLabels,
  adminCreateLabel,
  adminDeleteLabel,
} from '../../services/labelService'
import type { Category, CategoryScope, Label } from '../../types'

// ── Category section ──────────────────────────────────────────────────────────

function CategorySection({
  title,
  scope,
  items,
  onAdd,
  onDelete,
}: {
  title: string
  scope: CategoryScope
  items: Category[]
  onAdd: (name: string, scope: CategoryScope) => Promise<void>
  onDelete: (id: number) => void
}) {
  const [input, setInput] = useState('')
  const [saving, setSaving] = useState(false)

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault()
    const name = input.trim()
    if (!name) return
    setSaving(true)
    try { await onAdd(name, scope); setInput('') } finally { setSaving(false) }
  }

  return (
    <div className="bg-surface-container-lowest rounded-xl p-6">
      <h2 className="font-headline text-xl text-on-background mb-4">{title}</h2>
      <div className="flex flex-wrap gap-2 mb-4 min-h-[2rem]">
        {items.length === 0 ? (
          <p className="text-sm text-on-surface-variant italic">Aucune catégorie</p>
        ) : items.map(cat => (
          <span key={cat.id} className="flex items-center gap-1.5 bg-surface-container px-3 py-1.5 rounded-full text-sm text-on-surface-variant group">
            {cat.name}
            <button onClick={() => onDelete(cat.id)} className="opacity-0 group-hover:opacity-100 transition-opacity text-outline hover:text-error">
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </span>
        ))}
      </div>
      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Nouvelle catégorie…"
          className="flex-1 px-4 py-2 rounded-lg bg-surface border border-outline-variant/30 focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
        />
        <button type="submit" disabled={saving || !input.trim()} className="signature-cta px-4 py-2 rounded-lg text-white font-bold text-sm hover:opacity-90 disabled:opacity-50 flex items-center gap-1">
          <span className="material-symbols-outlined text-base">add</span>Ajouter
        </button>
      </form>
    </div>
  )
}

// ── Label (event tag) section ─────────────────────────────────────────────────

function LabelSection({
  items,
  onAdd,
  onDelete,
}: {
  items: Label[]
  onAdd: (name: string) => Promise<void>
  onDelete: (id: number) => void
}) {
  const [input, setInput] = useState('')
  const [saving, setSaving] = useState(false)

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault()
    const name = input.trim()
    if (!name) return
    setSaving(true)
    try { await onAdd(name); setInput('') } finally { setSaving(false) }
  }

  return (
    <div className="bg-surface-container-lowest rounded-xl p-6">
      <h2 className="font-headline text-xl text-on-background mb-1">Types d'événements</h2>
      <p className="text-sm text-on-surface-variant mb-4">Étiquettes "Compatible avec" affichées sur les articles du catalogue.</p>
      <div className="flex flex-wrap gap-2 mb-4 min-h-[2rem]">
        {items.length === 0 ? (
          <p className="text-sm text-on-surface-variant italic">Aucun label</p>
        ) : items.map(label => (
          <span key={label.id} className="flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-label group">
            {label.name}
            <button onClick={() => onDelete(label.id)} className="opacity-0 group-hover:opacity-100 transition-opacity text-primary/50 hover:text-error">
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </span>
        ))}
      </div>
      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="ex: Mariage, Anniversaire…"
          className="flex-1 px-4 py-2 rounded-lg bg-surface border border-outline-variant/30 focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
        />
        <button type="submit" disabled={saving || !input.trim()} className="signature-cta px-4 py-2 rounded-lg text-white font-bold text-sm hover:opacity-90 disabled:opacity-50 flex items-center gap-1">
          <span className="material-symbols-outlined text-base">add</span>Ajouter
        </button>
      </form>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function LabelsManager() {
  const [categories, setCategories] = useState<Category[]>([])
  const [labels, setLabels] = useState<Label[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    Promise.all([adminGetAllCategories(), adminGetAllLabels()])
      .then(([cats, lbls]) => { setCategories(cats); setLabels(lbls) })
      .finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const handleAddCategory = async (name: string, scope: CategoryScope) => {
    const created = await adminCreateCategory({ name, scope })
    setCategories(prev => [...prev, created])
  }

  const handleDeleteCategory = async (id: number) => {
    if (!confirm('Supprimer cette catégorie ?')) return
    await adminDeleteCategory(id)
    setCategories(prev => prev.filter(c => c.id !== id))
  }

  const handleAddLabel = async (name: string) => {
    const created = await adminCreateLabel({ name })
    setLabels(prev => [...prev, created])
  }

  const handleDeleteLabel = async (id: number) => {
    if (!confirm('Supprimer ce label ?')) return
    await adminDeleteLabel(id)
    setLabels(prev => prev.filter(l => l.id !== id))
  }

  const catalogueCategories = categories.filter(c => c.scope === 'CATALOGUE')
  const portfolioCategories = categories.filter(c => c.scope === 'PORTFOLIO')

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-headline text-3xl text-on-background">Étiquettes & Catégories</h1>
          <p className="text-on-surface-variant mt-1">Gérez les catégories et labels utilisés dans le catalogue et le portfolio.</p>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <span className="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <CategorySection
              title="Catégories Catalogue"
              scope="CATALOGUE"
              items={catalogueCategories}
              onAdd={handleAddCategory}
              onDelete={handleDeleteCategory}
            />
            <CategorySection
              title="Catégories Portfolio"
              scope="PORTFOLIO"
              items={portfolioCategories}
              onAdd={handleAddCategory}
              onDelete={handleDeleteCategory}
            />
            <LabelSection
              items={labels}
              onAdd={handleAddLabel}
              onDelete={handleDeleteLabel}
            />
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
