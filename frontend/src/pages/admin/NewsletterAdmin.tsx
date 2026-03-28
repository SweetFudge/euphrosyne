import { useEffect, useRef, useState } from 'react'
import EmailEditor, { type EditorRef } from 'react-email-editor'
import AdminLayout from '../../components/AdminLayout'
import ConfirmModal from '../../components/ConfirmModal'
import {
  adminGetSubscribers,
  adminGetTemplates,
  adminCreateTemplate,
  adminDeleteTemplate,
  adminGetCampaigns,
  adminSendCampaign,
} from '../../services/newsletterService'
import type { NewsletterSubscriber, NewsletterTemplate, NewsletterCampaign } from '../../types'

type Tab = 'subscribers' | 'compose' | 'templates' | 'history'

// ── Onglet Abonnés ────────────────────────────────────────────────────────────

function SubscribersTab({ subscribers }: { subscribers: NewsletterSubscriber[] }) {
  const active = subscribers.filter(s => s.active).length
  return (
    <div className="space-y-4">
      <p className="text-sm text-on-surface-variant">{active} abonné(s) actif(s) sur {subscribers.length} total</p>
      {subscribers.length === 0 ? (
        <div className="text-center py-16 text-on-surface-variant">Aucun abonné pour le moment.</div>
      ) : (
        <div className="bg-surface-container-lowest rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-surface-container">
              <tr>
                {['#', 'Email', "Date d'inscription", 'Statut'].map(h => (
                  <th key={h} className="text-left px-6 py-4 text-sm font-label uppercase tracking-wider text-on-surface-variant">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {subscribers.map((sub, i) => (
                <tr key={sub.id} className="hover:bg-surface-container/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-on-surface-variant">{i + 1}</td>
                  <td className="px-6 py-4 text-on-surface font-medium">{sub.email}</td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant">
                    {new Date(sub.subscribedAt).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-label ${sub.active ? 'bg-green-100 text-green-800' : 'bg-surface-container text-on-surface-variant'}`}>
                      {sub.active ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ── Onglet Historique ─────────────────────────────────────────────────────────

function HistoryTab({ campaigns }: { campaigns: NewsletterCampaign[] }) {
  if (campaigns.length === 0) {
    return <div className="text-center py-16 text-on-surface-variant">Aucune campagne envoyée pour le moment.</div>
  }
  return (
    <div className="bg-surface-container-lowest rounded-xl overflow-hidden">
      <table className="w-full">
        <thead className="bg-surface-container">
          <tr>
            {['Sujet', 'Destinataires', 'Date d\'envoi'].map(h => (
              <th key={h} className="text-left px-6 py-4 text-sm font-label uppercase tracking-wider text-on-surface-variant">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-variant/20">
          {campaigns.map(c => (
            <tr key={c.id} className="hover:bg-surface-container/50 transition-colors">
              <td className="px-6 py-4 text-on-surface font-medium">{c.subject}</td>
              <td className="px-6 py-4 text-sm text-on-surface-variant">{c.recipientCount} destinataire(s)</td>
              <td className="px-6 py-4 text-sm text-on-surface-variant">
                {new Date(c.sentAt).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ── Onglet Templates ──────────────────────────────────────────────────────────

function TemplatesTab({
  templates,
  onLoad,
  onDelete,
}: {
  templates: NewsletterTemplate[]
  onLoad: (t: NewsletterTemplate) => void
  onDelete: (id: number) => void
}) {
  if (templates.length === 0) {
    return <div className="text-center py-16 text-on-surface-variant">Aucun template sauvegardé. Composez une newsletter et sauvegardez-la comme template.</div>
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {templates.map(t => (
        <div key={t.id} className="bg-surface-container-lowest rounded-xl p-5 flex flex-col gap-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-label font-semibold text-on-surface">{t.name}</p>
              <p className="text-xs text-on-surface-variant mt-0.5">
                {new Date(t.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
            <button onClick={() => onDelete(t.id)} className="text-outline hover:text-error transition-colors p-1">
              <span className="material-symbols-outlined text-base">delete</span>
            </button>
          </div>
          <button
            onClick={() => onLoad(t)}
            className="signature-cta w-full py-2 rounded-lg text-white text-sm font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">edit</span>
            Utiliser ce template
          </button>
        </div>
      ))}
    </div>
  )
}

// ── Onglet Composer ───────────────────────────────────────────────────────────

function ComposeTab({
  templates,
  activeSubscribersCount,
  onCampaignSent,
  onTemplateSaved,
  loadDesignRef,
}: {
  templates: NewsletterTemplate[]
  activeSubscribersCount: number
  onCampaignSent: (c: NewsletterCampaign) => void
  onTemplateSaved: (t: NewsletterTemplate) => void
  loadDesignRef: React.MutableRefObject<((t: NewsletterTemplate) => void) | null>
}) {
  const editorRef = useRef<EditorRef>(null)
  const [subject, setSubject] = useState('')
  const [templateName, setTemplateName] = useState('')
  const [saving, setSaving] = useState(false)
  const [sending, setSending] = useState(false)
  const [editorReady, setEditorReady] = useState(false)
  const [saveModal, setSaveModal] = useState(false)

  // Permet au parent de déclencher un loadDesign depuis l'onglet Templates
  loadDesignRef.current = (t: NewsletterTemplate) => {
    editorRef.current?.editor?.loadDesign(JSON.parse(t.designJson))
    setSubject('')
  }

  const exportAndRun = (callback: (html: string, designJson: string) => void) => {
    editorRef.current?.editor?.exportHtml(({ html, design }) => {
      callback(html, JSON.stringify(design))
    })
  }

  const handleSaveTemplate = () => {
    if (!templateName.trim()) return
    setSaving(true)
    exportAndRun(async (html, designJson) => {
      try {
        const created = await adminCreateTemplate({ name: templateName.trim(), designJson, htmlContent: html })
        onTemplateSaved(created)
        setSaveModal(false)
        setTemplateName('')
      } finally {
        setSaving(false)
      }
    })
  }

  const handleSend = () => {
    if (!subject.trim()) return
    setSending(true)
    exportAndRun(async (html, designJson) => {
      try {
        const campaign = await adminSendCampaign({ subject: subject.trim(), htmlContent: html, designJson })
        onCampaignSent(campaign)
        setSubject('')
      } finally {
        setSending(false)
      }
    })
  }

  return (
    <div className="space-y-4">
      {/* Barre d'actions */}
      <div className="bg-surface-container-lowest rounded-xl p-4 flex flex-wrap items-center gap-3">
        <input
          value={subject}
          onChange={e => setSubject(e.target.value)}
          placeholder="Objet de la newsletter…"
          className="flex-1 min-w-48 px-4 py-2 rounded-lg bg-surface border border-outline-variant/30 focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
        />
        <button
          onClick={() => setSaveModal(true)}
          disabled={!editorReady}
          className="px-4 py-2 rounded-lg border border-primary text-primary text-sm font-bold hover:bg-primary/5 disabled:opacity-40 transition-colors flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-base">bookmark</span>
          Sauvegarder template
        </button>
        <button
          onClick={handleSend}
          disabled={!subject.trim() || !editorReady || sending}
          className="signature-cta px-5 py-2 rounded-lg text-white text-sm font-bold hover:opacity-90 disabled:opacity-40 flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-base">{sending ? 'progress_activity' : 'send'}</span>
          {sending ? 'Envoi…' : `Envoyer (${activeSubscribersCount})`}
        </button>
      </div>

      {/* Éditeur Unlayer */}
      <div className="rounded-xl overflow-hidden border border-outline-variant/20" style={{ height: '620px' }}>
        <EmailEditor
          ref={editorRef}
          onReady={() => setEditorReady(true)}
          options={{
            locale: 'fr-FR',
            appearance: {
              theme: 'light',
              panels: { tools: { dock: 'left' } },
            },
            fonts: {
              showDefaultFonts: true,
              customFonts: [
                {
                  label: 'Noto Serif',
                  value: "'Noto Serif', serif",
                  url: 'https://fonts.googleapis.com/css2?family=Noto+Serif:ital,wght@0,400;0,600;1,400&display=swap',
                },
                {
                  label: 'Manrope',
                  value: "'Manrope', sans-serif",
                  url: 'https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&display=swap',
                },
                {
                  label: 'Playfair Display',
                  value: "'Playfair Display', serif",
                  url: 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap',
                },
                {
                  label: 'Cormorant Garamond',
                  value: "'Cormorant Garamond', serif",
                  url: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&display=swap',
                },
                {
                  label: 'Lato',
                  value: "'Lato', sans-serif",
                  url: 'https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap',
                },
              ],
            },
          }}
        />
      </div>

      {/* Modal sauvegarde template */}
      {saveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-on-background/30 backdrop-blur-sm" onClick={() => setSaveModal(false)} />
          <div className="relative bg-surface rounded-2xl shadow-xl w-full max-w-sm p-6 flex flex-col gap-5">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mx-auto">
              <span className="material-symbols-outlined text-primary text-2xl">bookmark_add</span>
            </div>
            <div className="text-center">
              <h3 className="font-headline text-lg text-on-surface">Sauvegarder comme template</h3>
              <p className="text-sm text-on-surface-variant mt-1">Donnez un nom à ce template pour le réutiliser.</p>
            </div>
            <input
              value={templateName}
              onChange={e => setTemplateName(e.target.value)}
              placeholder="ex: Offre printemps 2026…"
              className="px-4 py-2.5 rounded-xl border border-outline-variant/30 focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
              autoFocus
            />
            <div className="flex gap-3">
              <button onClick={() => setSaveModal(false)} className="flex-1 px-4 py-2.5 rounded-xl border border-outline-variant text-on-surface-variant text-sm font-label hover:bg-surface-container transition-colors">
                Annuler
              </button>
              <button
                onClick={handleSaveTemplate}
                disabled={!templateName.trim() || saving}
                className="flex-1 signature-cta px-4 py-2.5 rounded-xl text-white text-sm font-label font-bold hover:opacity-90 disabled:opacity-50"
              >
                {saving ? 'Sauvegarde…' : 'Sauvegarder'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Page principale ───────────────────────────────────────────────────────────

export default function NewsletterAdmin() {
  const [tab, setTab] = useState<Tab>('subscribers')
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([])
  const [templates, setTemplates] = useState<NewsletterTemplate[]>([])
  const [campaigns, setCampaigns] = useState<NewsletterCampaign[]>([])
  const [loading, setLoading] = useState(true)
  const [confirm, setConfirm] = useState<{ open: boolean; id: number }>({ open: false, id: 0 })
  const loadDesignRef = useRef<((t: NewsletterTemplate) => void) | null>(null)

  useEffect(() => {
    Promise.all([adminGetSubscribers(), adminGetTemplates(), adminGetCampaigns()])
      .then(([subs, tmpl, camps]) => { setSubscribers(subs); setTemplates(tmpl); setCampaigns(camps) })
      .finally(() => setLoading(false))
  }, [])

  const handleLoadTemplate = (t: NewsletterTemplate) => {
    setTab('compose')
    setTimeout(() => loadDesignRef.current?.(t), 100)
  }

  const handleDeleteTemplate = (id: number) => setConfirm({ open: true, id })

  const doDeleteTemplate = async () => {
    await adminDeleteTemplate(confirm.id)
    setTemplates(prev => prev.filter(t => t.id !== confirm.id))
    setConfirm({ open: false, id: 0 })
  }

  const activeSubscribersCount = subscribers.filter(s => s.active).length

  const TABS: { key: Tab; label: string; icon: string }[] = [
    { key: 'subscribers', label: 'Abonnés', icon: 'group' },
    { key: 'compose', label: 'Composer', icon: 'edit' },
    { key: 'templates', label: 'Templates', icon: 'bookmark' },
    { key: 'history', label: 'Historique', icon: 'history' },
  ]

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-headline text-3xl text-on-background">Newsletter</h1>
          <p className="text-on-surface-variant mt-1">{activeSubscribersCount} abonné(s) actif(s)</p>
        </div>

        {/* Onglets */}
        <div className="flex gap-1 bg-surface-container rounded-xl p-1 w-fit">
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-label transition-all ${
                tab === t.key
                  ? 'bg-surface shadow-sm text-primary font-bold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-base">{t.icon}</span>
              {t.label}
              {t.key === 'templates' && templates.length > 0 && (
                <span className="bg-primary/10 text-primary text-xs px-1.5 rounded-full">{templates.length}</span>
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-16">
            <span className="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
          </div>
        ) : (
          <>
            {tab === 'subscribers' && <SubscribersTab subscribers={subscribers} />}
            {tab === 'compose' && (
              <ComposeTab
                templates={templates}
                activeSubscribersCount={activeSubscribersCount}
                onCampaignSent={c => { setCampaigns(prev => [c, ...prev]); setTab('history') }}
                onTemplateSaved={t => setTemplates(prev => [t, ...prev])}
                loadDesignRef={loadDesignRef}
              />
            )}
            {tab === 'templates' && (
              <TemplatesTab
                templates={templates}
                onLoad={handleLoadTemplate}
                onDelete={handleDeleteTemplate}
              />
            )}
            {tab === 'history' && <HistoryTab campaigns={campaigns} />}
          </>
        )}
      </div>

      <ConfirmModal
        open={confirm.open}
        title="Supprimer le template"
        message="Cette action est irréversible."
        onConfirm={doDeleteTemplate}
        onCancel={() => setConfirm({ open: false, id: 0 })}
      />
    </AdminLayout>
  )
}
