import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <section className="relative h-[921px] overflow-hidden flex items-center">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1600&q=80"
          alt="Euphrosyne — événement d'exception"
          className="w-full h-full object-cover brightness-[0.80]"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full">
        <div className="max-w-2xl bg-surface/40 backdrop-blur-md p-10 rounded-xl md:rounded-none border-l-4 border-primary">
          <span className="text-primary font-label uppercase tracking-[0.2em] text-sm mb-4 block">
            Organisation d'événements sur mesure
          </span>
          <h1 className="font-headline text-5xl md:text-7xl text-on-background mb-6 leading-tight -tracking-widest">
            Euphrosyne
          </h1>
          <p className="text-on-surface-variant text-lg md:text-xl mb-10 max-w-lg font-light leading-relaxed">
            De vos mariages aux fêtes les plus intimes — nous concevons chaque instant avec passion, élégance et un souci du détail sans égal.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/catalogue"
              className="signature-cta px-10 py-4 rounded-full text-white font-bold text-lg hover:scale-[1.02] transition-transform text-center"
            >
              Voir le catalogue
            </Link>
            <Link
              to="/contact"
              className="px-10 py-4 rounded-full border border-outline/20 text-on-background font-bold text-lg hover:bg-surface-container transition-colors text-center"
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </div>

      {/* Floating image */}
      <div className="absolute bottom-12 right-12 hidden lg:block w-72 h-96 rounded-lg overflow-hidden shadow-2xl border-[12px] border-surface-container-lowest transform rotate-3">
        <img
          src="https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&q=80"
          alt="Détails événement Euphrosyne"
          className="w-full h-full object-cover"
        />
      </div>
    </section>
  )
}
