import { Link } from 'react-router-dom'
import Hero from '../components/Hero'
import PortfolioGrid from '../components/PortfolioGrid'
import NewsletterCta from '../components/NewsletterCta'

// Remplacez cette URL par votre vidéo YouTube ou Vimeo
const PRESENTATION_VIDEO_URL = 'https://www.youtube.com/embed/dQw4w9WgXcQ'

const services = [
  {
    icon: 'favorite',
    title: 'Mariages',
    description: 'Du classique au bohème, nous imaginons votre mariage idéal et prenons soin de chaque détail pour que votre journée soit parfaite.',
    link: '/catalogue',
  },
  {
    icon: 'celebration',
    title: 'Fêtes Privées',
    description: 'Anniversaires, soirées, réceptions — nous créons des atmosphères sur mesure qui reflètent votre personnalité.',
    link: '/catalogue',
  },
  {
    icon: 'star',
    title: 'Événements',
    description: 'Séminaires, galas, inaugurations — Euphrosyne accompagne vos projets professionnels avec le même soin du détail.',
    link: '/contact',
  },
]

export default function Home() {
  return (
    <>
      <Hero />

      {/* Services aperçu */}
      <section className="py-24 bg-surface-container-low">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <span className="text-primary font-label uppercase tracking-[0.2em] text-sm mb-4 block">
              Ce que nous créons
            </span>
            <h2 className="font-headline text-4xl md:text-5xl text-on-background">
              Nos Spécialités
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map(({ icon, title, description, link }) => (
              <div key={title} className="bg-surface-container-lowest p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow group">
                <span className="material-symbols-outlined text-primary text-4xl mb-6 block">
                  {icon}
                </span>
                <h3 className="font-headline text-2xl text-on-background mb-3">{title}</h3>
                <p className="text-on-surface-variant leading-relaxed mb-6">{description}</p>
                <Link
                  to={link}
                  className="text-primary font-semibold flex items-center gap-2 group-hover:gap-3 transition-all"
                >
                  En savoir plus
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vidéo de présentation */}
      <section className="py-24 bg-surface">
        <div className="max-w-5xl mx-auto px-6 md:px-12">
          <div className="text-center mb-12">
            <span className="text-primary font-label uppercase tracking-[0.2em] text-sm mb-4 block">
              Découvrez Euphrosyne
            </span>
            <h2 className="font-headline text-4xl md:text-5xl text-on-background mb-6">
              Regardez Notre Histoire
            </h2>
            <p className="text-on-surface-variant text-lg max-w-2xl mx-auto font-light">
              En quelques minutes, découvrez notre univers, notre approche et les événements que nous avons eu la chance de concevoir.
            </p>
          </div>
          <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-video bg-surface-container">
            <iframe
              src={PRESENTATION_VIDEO_URL}
              title="Présentation Euphrosyne"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </div>
      </section>

      {/* Portfolio aperçu */}
      <PortfolioGrid limit={4} />

      <NewsletterCta />
    </>
  )
}
