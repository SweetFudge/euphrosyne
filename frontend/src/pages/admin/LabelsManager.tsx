import { useEffect, useState, type FormEvent } from 'react'
import AdminLayout from '../../components/AdminLayout'
import ConfirmModal from '../../components/ConfirmModal'
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
  const [open, setOpen] = useState(false)

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault()
    const name = input.trim()
    if (!name) return
    setSaving(true)
    try { await onAdd(name, scope); setInput(''); setOpen(true) } finally { setSaving(false) }
  }

  return (
    <div className="bg-surface-container-lowest rounded-xl overflow-hidden">
      {/* Header accordéon */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-surface-container transition-colors"
      >
        <h2 className="font-headline text-xl text-on-background">{title}</h2>
        <div className="flex items-center gap-2">
          <span className="text-xs font-label bg-primary/10 text-primary px-2 py-0.5 rounded-full">
            {items.length}
          </span>
          <span className={`material-symbols-outlined text-outline transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
            expand_more
          </span>
        </div>
      </button>

      {/* Liste collapsible */}
      <div className={`transition-all duration-200 overflow-hidden ${open ? 'max-h-64' : 'max-h-0'}`}>
        <div className="overflow-y-auto max-h-64 border-t border-outline-variant/20">
          {items.length === 0 ? (
            <p className="text-sm text-on-surface-variant italic px-6 py-4">Aucune catégorie</p>
          ) : items.map((cat, i) => (
            <div
              key={cat.id}
              className={`flex items-center justify-between px-6 py-2.5 group hover:bg-surface-container transition-colors ${i < items.length - 1 ? 'border-b border-outline-variant/10' : ''}`}
            >
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/40 flex-shrink-0" />
                <span className="text-sm text-on-surface">{cat.name}</span>
              </div>
              <button
                onClick={() => onDelete(cat.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-outline hover:text-error p-0.5 rounded"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Formulaire d'ajout */}
      <div className="px-6 py-4 border-t border-outline-variant/20">
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
  const [open, setOpen] = useState(false)

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault()
    const name = input.trim()
    if (!name) return
    setSaving(true)
    try { await onAdd(name); setInput(''); setOpen(true) } finally { setSaving(false) }
  }

  return (
    <div className="bg-surface-container-lowest rounded-xl overflow-hidden">
      {/* Header accordéon */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-surface-container transition-colors"
      >
        <div className="text-left">
          <h2 className="font-headline text-xl text-on-background">Types d'événements</h2>
          <p className="text-xs text-on-surface-variant mt-0.5">Étiquettes "Compatible avec" du catalogue</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xs font-label bg-primary/10 text-primary px-2 py-0.5 rounded-full">
            {items.length}
          </span>
          <span className={`material-symbols-outlined text-outline transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
            expand_more
          </span>
        </div>
      </button>

      {/* Liste collapsible */}
      <div className={`transition-all duration-200 overflow-hidden ${open ? 'max-h-64' : 'max-h-0'}`}>
        <div className="overflow-y-auto max-h-64 border-t border-outline-variant/20">
          {items.length === 0 ? (
            <p className="text-sm text-on-surface-variant italic px-6 py-4">Aucun label</p>
          ) : items.map((label, i) => (
            <div
              key={label.id}
              className={`flex items-center justify-between px-6 py-2.5 group hover:bg-surface-container transition-colors ${i < items.length - 1 ? 'border-b border-outline-variant/10' : ''}`}
            >
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                <span className="text-sm text-on-surface">{label.name}</span>
              </div>
              <button
                onClick={() => onDelete(label.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-outline hover:text-error p-0.5 rounded"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Formulaire d'ajout */}
      <div className="px-6 py-4 border-t border-outline-variant/20">
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
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

type ConfirmState = { open: boolean; title: string; message: string; onConfirm: () => void }
const closedConfirm: ConfirmState = { open: false, title: '', message: '', onConfirm: () => {} }

export default function LabelsManager() {
  const [categories, setCategories] = useState<Category[]>([])
  const [labels, setLabels] = useState<Label[]>([])
  const [loading, setLoading] = useState(true)
  const [confirm, setConfirm] = useState<ConfirmState>(closedConfirm)

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

  const handleDeleteCategory = (id: number) => {
    setConfirm({
      open: true,
      title: 'Supprimer la catégorie',
      message: 'Cette action est irréversible.',
      onConfirm: async () => {
        await adminDeleteCategory(id)
        setCategories(prev => prev.filter(c => c.id !== id))
        setConfirm(closedConfirm)
      },
    })
  }

  const handleAddLabel = async (name: string) => {
    const created = await adminCreateLabel({ name })
    setLabels(prev => [...prev, created])
  }

  const handleDeleteLabel = (id: number) => {
    setConfirm({
      open: true,
      title: "Supprimer l'étiquette",
      message: 'Cette action est irréversible.',
      onConfirm: async () => {
        await adminDeleteLabel(id)
        setLabels(prev => prev.filter(l => l.id !== id))
        setConfirm(closedConfirm)
      },
    })
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

      <ConfirmModal
        open={confirm.open}
        title={confirm.title}
        message={confirm.message}
        onConfirm={confirm.onConfirm}
        onCancel={() => setConfirm(closedConfirm)}
      />
    </AdminLayout>
  )
}
