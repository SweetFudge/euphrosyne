import { useState, type FormEvent, type ChangeEvent } from 'react'
import { createContact } from '../services/contactService'
import { createReservation } from '../services/reservationService'
import type { EventType, ContactFormData, ReservationFormData } from '../types'

const EVENT_TYPES: { value: EventType; label: string; icon: string }[] = [
  { value: 'MARIAGE', label: 'Mariage', icon: 'favorite' },
  { value: 'FETE_PRIVEE', label: 'Fête Privée', icon: 'celebration' },
  { value: 'ANNIVERSAIRE', label: 'Anniversaire', icon: 'cake' },
]

const CONTACTS = [
  { icon: 'call', label: 'Téléphone', value: '+33 6 XX XX XX XX', href: 'tel:+336XXXXXXXX' },
  { icon: 'chat', label: 'WhatsApp', value: '+33 6 XX XX XX XX', href: 'https://wa.me/336XXXXXXXX' },
  { icon: 'mail', label: 'Email', value: 'contact@euphrosyne.fr', href: 'mailto:contact@euphrosyne.fr' },
  { icon: 'schedule', label: 'Horaires', value: 'Lun–Sam · 9h–19h', href: null },
]

const emptyContact: ContactFormData = {
  firstName: '', lastName: '', email: '', eventType: '', eventDate: '', message: '',
}

const emptyDevis: ReservationFormData = {
  firstName: '', lastName: '', email: '', phone: '',
  eventType: '', eventDate: '', guestCount: '', budget: '', message: '',
}

export default function Contact() {
  const [contactForm, setContactForm] = useState<ContactFormData>(emptyContact)
  const [contactStatus, setContactStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const [devisForm, setDevisForm] = useState<ReservationFormData>(emptyDevis)
  const [devisStatus, setDevisStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleContactChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setContactForm({ ...contactForm, [e.target.name]: e.target.value })
  }

  const handleDevisChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setDevisForm({ ...devisForm, [e.target.name]: e.target.value })
  }

  const handleContactSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setContactStatus('loading')
    try {
      await createContact(contactForm)
      setContactStatus('success')
      setContactForm(emptyContact)
    } catch {
      setContactStatus('error')
    }
  }

  const handleDevisSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!devisForm.eventType) return
    setDevisStatus('loading')
    try {
      await createReservation({
        firstName: devisForm.firstName,
        lastName: devisForm.lastName,
        email: devisForm.email,
        phone: devisForm.phone || undefined,
        eventType: devisForm.eventType as EventType,
        eventDate: devisForm.eventDate,
        guestCount: devisForm.guestCount ? parseInt(devisForm.guestCount) : undefined,
        budget: devisForm.budget ? parseFloat(devisForm.budget) : undefined,
        message: devisForm.message || undefined,
      })
      setDevisStatus('success')
      setDevisForm(emptyDevis)
    } catch {
      setDevisStatus('error')
    }
  }

  return (
    <div className="pt-20">

      {/* Hero */}
      <section className="py-20 bg-surface-container-low">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <span className="text-primary font-label uppercase tracking-[0.2em] text-sm mb-4 block">
            Parlons de votre projet
          </span>
          <h1 className="font-headline text-5xl md:text-6xl text-on-background mb-6 leading-tight">
            Contactez-nous
          </h1>
          <p className="text-on-surface-variant text-xl font-light leading-relaxed">
            Un projet en tête ? Une question sur notre catalogue ? Nous sommes là pour vous accompagner à chaque étape.
          </p>
        </div>
      </section>

      {/* Coordonnées */}
      <section className="py-16 bg-surface">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {CONTACTS.map(({ icon, label, value, href }) => (
              <div key={label} className="flex items-start gap-4 p-4 bg-surface-container-low rounded-xl">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-primary text-xl">{icon}</span>
                </div>
                <div>
                  <p className="text-xs font-label uppercase tracking-wider text-on-surface-variant mb-1">{label}</p>
                  {href ? (
                    <a href={href} className="text-on-background font-medium hover:text-primary transition-colors text-sm">
                      {value}
                    </a>
                  ) : (
                    <p className="text-on-background font-medium text-sm">{value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <a
            href="https://wa.me/336XXXXXXXX"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-6 py-4 rounded-xl bg-green-500 text-white font-bold hover:bg-green-600 transition-colors"
          >
            <span className="material-symbols-outlined">chat</span>
            Écrire sur WhatsApp
          </a>
        </div>
      </section>

      {/* Section Nous écrire */}
      <section id="contact" className="py-16 bg-surface-container-low">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="font-headline text-4xl text-on-background mb-3">Nous écrire</h2>
            <p className="text-on-surface-variant">Une question, une demande d'information ? Envoyez-nous un message.</p>
          </div>

          {contactStatus === 'success' ? (
            <div className="text-center py-16 bg-surface rounded-2xl">
              <span className="material-symbols-outlined text-6xl text-primary mb-6 block">check_circle</span>
              <h3 className="font-headline text-3xl text-on-background mb-4">Message envoyé !</h3>
              <p className="text-on-surface-variant text-lg max-w-sm mx-auto">
                Merci pour votre message. Nous vous répondrons dans les plus brefs délais.
              </p>
              <button
                onClick={() => setContactStatus('idle')}
                className="mt-8 signature-cta px-8 py-3 rounded-full text-white font-bold hover:opacity-90"
              >
                Nouveau message
              </button>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="bg-surface p-8 rounded-2xl space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-label uppercase tracking-wider text-on-surface-variant mb-2 block">
                    Prénom <span className="text-primary">*</span>
                  </label>
                  <input
                    name="firstName"
                    value={contactForm.firstName}
                    onChange={handleContactChange}
                    required
                    placeholder="Sophie"
                    className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/30 focus:ring-2 focus:ring-primary outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="text-sm font-label uppercase tracking-wider text-on-surface-variant mb-2 block">
                    Nom <span className="text-primary">*</span>
                  </label>
                  <input
                    name="lastName"
                    value={contactForm.lastName}
                    onChange={handleContactChange}
                    required
                    placeholder="Dupont"
                    className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/30 focus:ring-2 focus:ring-primary outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-label uppercase tracking-wider text-on-surface-variant mb-2 block">
                  Email <span className="text-primary">*</span>
                </label>
                <input
                  name="email"
                  type="email"
                  value={contactForm.email}
                  onChange={handleContactChange}
                  required
                  placeholder="sophie@example.com"
                  className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/30 focus:ring-2 focus:ring-primary outline-none transition-all"
                />
              </div>

              <div>
                <label className="text-sm font-label uppercase tracking-wider text-on-surface-variant mb-2 block">
                  Type d'événement
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {EVENT_TYPES.map(({ value, label, icon }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setContactForm({ ...contactForm, eventType: value })}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                        contactForm.eventType === value
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-outline-variant/30 text-on-surface-variant hover:border-primary/30'
                      }`}
                    >
                      <span className="material-symbols-outlined text-2xl">{icon}</span>
                      <span className="text-sm font-semibold">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-label uppercase tracking-wider text-on-surface-variant mb-2 block">
                  Date prévue
                </label>
                <input
                  name="eventDate"
                  type="date"
                  value={contactForm.eventDate}
                  onChange={handleContactChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/30 focus:ring-2 focus:ring-primary outline-none transition-all"
                />
              </div>

              <div>
                <label className="text-sm font-label uppercase tracking-wider text-on-surface-variant mb-2 block">
                  Message <span className="text-primary">*</span>
                </label>
                <textarea
                  name="message"
                  value={contactForm.message}
                  onChange={handleContactChange}
                  required
                  rows={4}
                  placeholder="Votre question, votre demande…"
                  className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/30 focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
                />
              </div>

              {contactStatus === 'error' && (
                <div className="bg-error-container text-on-error-container px-4 py-3 rounded-xl text-sm">
                  Une erreur est survenue. Vérifiez les champs et réessayez.
                </div>
              )}

              <button
                type="submit"
                disabled={contactStatus === 'loading'}
                className="signature-cta w-full py-4 rounded-full text-white font-bold text-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {contactStatus === 'loading' ? (
                  <><span className="material-symbols-outlined animate-spin text-base">progress_activity</span>Envoi en cours…</>
                ) : (
                  <><span className="material-symbols-outlined text-base">send</span>Envoyer</>
                )}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Section Demander un devis */}
      <section id="devis" className="py-16 bg-surface">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="font-headline text-4xl text-on-background mb-3">Demander un devis</h2>
            <p className="text-on-surface-variant">Vous avez un projet précis ? Partagez-nous les détails pour recevoir une offre personnalisée.</p>
          </div>

          {devisStatus === 'success' ? (
            <div className="text-center py-16 bg-surface-container-low rounded-2xl">
              <span className="material-symbols-outlined text-6xl text-primary mb-6 block">check_circle</span>
              <h3 className="font-headline text-3xl text-on-background mb-4">Demande envoyée !</h3>
              <p className="text-on-surface-variant text-lg max-w-sm mx-auto">
                Merci pour votre demande de devis. Nous reviendrons vers vous sous 48h.
              </p>
              <button
                onClick={() => setDevisStatus('idle')}
                className="mt-8 signature-cta px-8 py-3 rounded-full text-white font-bold hover:opacity-90"
              >
                Nouvelle demande
              </button>
            </div>
          ) : (
            <form onSubmit={handleDevisSubmit} className="bg-surface-container-low p-8 rounded-2xl space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-label uppercase tracking-wider text-on-surface-variant mb-2 block">
                    Prénom <span className="text-primary">*</span>
                  </label>
                  <input
                    name="firstName"
                    value={devisForm.firstName}
                    onChange={handleDevisChange}
                    required
                    placeholder="Sophie"
                    className="w-full px-4 py-3 rounded-xl bg-surface border border-outline-variant/30 focus:ring-2 focus:ring-primary outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="text-sm font-label uppercase tracking-wider text-on-surface-variant mb-2 block">
                    Nom <span className="text-primary">*</span>
                  </label>
                  <input
                    name="lastName"
                    value={devisForm.lastName}
                    onChange={handleDevisChange}
                    required
                    placeholder="Dupont"
                    className="w-full px-4 py-3 rounded-xl bg-surface border border-outline-variant/30 focus:ring-2 focus:ring-primary outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-label uppercase tracking-wider text-on-surface-variant mb-2 block">
                    Email <span className="text-primary">*</span>
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={devisForm.email}
                    onChange={handleDevisChange}
                    required
                    placeholder="sophie@example.com"
                    className="w-full px-4 py-3 rounded-xl bg-surface border border-outline-variant/30 focus:ring-2 focus:ring-primary outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="text-sm font-label uppercase tracking-wider text-on-surface-variant mb-2 block">
                    Téléphone
                  </label>
                  <input
                    name="phone"
                    type="tel"
                    value={devisForm.phone}
                    onChange={handleDevisChange}
                    placeholder="+33 6 00 00 00 00"
                    className="w-full px-4 py-3 rounded-xl bg-surface border border-outline-variant/30 focus:ring-2 focus:ring-primary outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-label uppercase tracking-wider text-on-surface-variant mb-3 block">
                  Type d'événement <span className="text-primary">*</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {EVENT_TYPES.map(({ value, label, icon }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setDevisForm({ ...devisForm, eventType: value })}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                        devisForm.eventType === value
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-outline-variant/30 text-on-surface-variant hover:border-primary/30'
                      }`}
                    >
                      <span className="material-symbols-outlined text-2xl">{icon}</span>
                      <span className="text-sm font-semibold">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-label uppercase tracking-wider text-on-surface-variant mb-2 block">
                  Date de l'événement <span className="text-primary">*</span>
                </label>
                <input
                  name="eventDate"
                  type="date"
                  value={devisForm.eventDate}
                  onChange={handleDevisChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 rounded-xl bg-surface border border-outline-variant/30 focus:ring-2 focus:ring-primary outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-label uppercase tracking-wider text-on-surface-variant mb-2 block">
                    Nombre d'invités
                  </label>
                  <input
                    name="guestCount"
                    type="number"
                    min={1}
                    value={devisForm.guestCount}
                    onChange={handleDevisChange}
                    placeholder="ex: 80"
                    className="w-full px-4 py-3 rounded-xl bg-surface border border-outline-variant/30 focus:ring-2 focus:ring-primary outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="text-sm font-label uppercase tracking-wider text-on-surface-variant mb-2 block">
                    Budget estimé (€)
                  </label>
                  <input
                    name="budget"
                    type="number"
                    min={0}
                    value={devisForm.budget}
                    onChange={handleDevisChange}
                    placeholder="ex: 3000"
                    className="w-full px-4 py-3 rounded-xl bg-surface border border-outline-variant/30 focus:ring-2 focus:ring-primary outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-label uppercase tracking-wider text-on-surface-variant mb-2 block">
                  Message
                </label>
                <textarea
                  name="message"
                  value={devisForm.message}
                  onChange={handleDevisChange}
                  rows={4}
                  placeholder="Décrivez votre projet, vos envies, vos inspirations…"
                  className="w-full px-4 py-3 rounded-xl bg-surface border border-outline-variant/30 focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
                />
              </div>

              {devisStatus === 'error' && (
                <div className="bg-error-container text-on-error-container px-4 py-3 rounded-xl text-sm">
                  Une erreur est survenue. Vérifiez les champs et réessayez.
                </div>
              )}

              <button
                type="submit"
                disabled={devisStatus === 'loading' || !devisForm.eventType}
                className="signature-cta w-full py-4 rounded-full text-white font-bold text-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {devisStatus === 'loading' ? (
                  <><span className="material-symbols-outlined animate-spin text-base">progress_activity</span>Envoi en cours…</>
                ) : (
                  <><span className="material-symbols-outlined text-base">request_quote</span>Envoyer la demande</>
                )}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  )
}
