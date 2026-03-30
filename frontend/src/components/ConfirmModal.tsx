interface ConfirmModalProps {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  loading?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = 'Supprimer',
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-on-background/30 backdrop-blur-sm"
        onClick={loading ? undefined : onCancel}
      />

      {/* Card */}
      <div className="relative bg-surface rounded-2xl shadow-xl w-full max-w-sm p-6 flex flex-col gap-5">
        {/* Icône */}
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-error/10 mx-auto">
          <span className="material-symbols-outlined text-error text-2xl">delete_forever</span>
        </div>

        {/* Texte */}
        <div className="text-center">
          <h3 className="font-headline text-lg text-on-surface">{title}</h3>
          <p className="text-sm text-on-surface-variant mt-1">{message}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-xl border border-outline-variant text-on-surface-variant text-sm font-label hover:bg-surface-container transition-colors disabled:opacity-50"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-xl bg-error text-on-error text-sm font-label font-bold hover:opacity-90 transition-opacity disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {loading && (
              <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>
            )}
            {loading ? 'Suppression…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
