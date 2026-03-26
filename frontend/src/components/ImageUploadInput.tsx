import { useRef, useState, type ChangeEvent } from 'react'
import { uploadImage } from '../services/uploadService'

interface Props {
  value: string
  onChange: (url: string) => void
}

export default function ImageUploadInput({ value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string>(value)
  const [uploading, setUploading] = useState(false)

  const handleFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    // Instant local preview
    const localUrl = URL.createObjectURL(file)
    setPreview(localUrl)
    setUploading(true)
    try {
      const url = await uploadImage(file)
      onChange(url)
      setPreview(url)
    } catch {
      setPreview(value)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="hidden"
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-surface border border-outline-variant/30 hover:border-primary/50 transition-all text-on-surface-variant disabled:opacity-60"
      >
        <span className="material-symbols-outlined text-xl">
          {uploading ? 'progress_activity' : 'upload'}
        </span>
        <span className="text-sm">
          {uploading ? 'Envoi en cours…' : value ? 'Changer l\'image' : 'Choisir une image'}
        </span>
      </button>
      {preview && (
        <div className="rounded-lg overflow-hidden h-40">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
        </div>
      )}
    </div>
  )
}
