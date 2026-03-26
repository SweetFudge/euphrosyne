import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function AdminLogin() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await login(form.username, form.password)
      navigate('/admin/dashboard')
    } catch {
      setError('Identifiants incorrects.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-surface-container-low flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="font-headline text-3xl text-amber-900 tracking-tighter mb-2">Euphrosyne</h1>
          <p className="text-on-surface-variant text-sm font-label uppercase tracking-widest">Espace Administration</p>
        </div>

        <div className="bg-surface-container-lowest p-10 rounded-xl shadow-sm">
          <h2 className="font-headline text-2xl text-on-background mb-8 text-center">Connexion</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-sm font-label uppercase tracking-wider text-on-surface-variant mb-2 block">
                Identifiant
              </label>
              <input
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-lg bg-surface border border-outline-variant/30 focus:ring-2 focus:ring-primary outline-none transition-all"
                placeholder="admin"
              />
            </div>
            <div>
              <label className="text-sm font-label uppercase tracking-wider text-on-surface-variant mb-2 block">
                Mot de passe
              </label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-lg bg-surface border border-outline-variant/30 focus:ring-2 focus:ring-primary outline-none transition-all"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="bg-error-container text-on-error-container px-4 py-3 rounded-lg text-sm">{error}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="signature-cta w-full py-4 rounded-full text-white font-bold text-lg hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
