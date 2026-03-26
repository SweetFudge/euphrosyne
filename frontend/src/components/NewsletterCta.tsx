import { useState, type FormEvent } from 'react'
import { subscribeNewsletter } from '../services/newsletterService'

export default function NewsletterCta() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'success' | 'error' | null>(null)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      await subscribeNewsletter(email)
      setStatus('success')
      setMessage('Merci ! Vous êtes maintenant inscrit(e) à nos inspirations exclusives.')
      setEmail('')
    } catch {
      setStatus('error')
      setMessage('Cet email est déjà inscrit ou une erreur est survenue.')
    }
  }

  return (
    <section className="py-24 bg-surface-container-high border-y border-outline-variant/10">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <span className="material-symbols-outlined text-primary text-5xl mb-6 block">mail</span>
        <h2 className="font-headline text-4xl mb-6 tracking-tight text-on-background">
          Restez Inspiré(e).
        </h2>
        <p className="text-on-surface-variant text-lg mb-10 font-light">
          Recevez nos inspirations exclusives et tendances pour vos futurs événements.
        </p>

        {status === 'success' ? (
          <div className="bg-secondary-container text-on-secondary-container px-6 py-4 rounded-xl max-w-lg mx-auto">
            <span className="material-symbols-outlined mr-2 align-middle">check_circle</span>
            {message}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Votre adresse email"
              className="flex-grow px-6 py-4 rounded-full bg-surface border-none focus:ring-2 focus:ring-primary text-on-surface placeholder:text-outline-variant transition-all outline-none"
            />
            <button
              type="submit"
              className="signature-cta px-10 py-4 rounded-full text-white font-bold hover:opacity-90 whitespace-nowrap"
            >
              S'inscrire
            </button>
          </form>
        )}

        {status === 'error' && (
          <p className="mt-4 text-error text-sm">{message}</p>
        )}
      </div>
    </section>
  )
}
