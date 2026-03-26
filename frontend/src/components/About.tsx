export default function About() {
  return (
    <section className="py-24 bg-surface-container-low overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        {/* Image side */}
        <div className="relative">
          <div className="aspect-[4/5] rounded-xl overflow-hidden shadow-sm relative z-10">
            <img
              src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80"
              alt="Sophie Beaumont, fondatrice d'Euphrosyne"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -top-10 -left-10 w-48 h-48 bg-primary-container/20 rounded-full blur-3xl -z-10" />
          <div className="absolute -bottom-10 -right-10 p-8 bg-surface-container-lowest shadow-xl rounded-xl z-20 max-w-[240px]">
            <p className="font-headline italic text-primary text-xl mb-2">
              "La joie se mérite, l'élégance se crée."
            </p>
            <span className="text-on-surface-variant text-sm font-label uppercase tracking-widest">
              — Sophie, Fondatrice
            </span>
          </div>
        </div>

        {/* Text side */}
        <div className="space-y-8">
          <div>
            <span className="text-primary font-label uppercase tracking-[0.2em] text-sm mb-4 block">
              Qui Sommes-Nous
            </span>
            <h2 className="font-headline text-4xl md:text-5xl text-on-background leading-tight">
              Artisans de Vos Moments les Plus Précieux.
            </h2>
          </div>
          <p className="text-on-surface-variant text-lg leading-relaxed">
            Fondée avec la conviction que chaque célébration mérite d'être unique, <strong>Euphrosyne</strong> met son expertise au service de vos rêves. Nous ne créons pas seulement des événements — nous orchestrons des émotions.
          </p>
          <div className="space-y-6 pt-4">
            <div className="flex items-start gap-4">
              <span className="material-symbols-outlined text-primary text-3xl">diamond</span>
              <div>
                <h4 className="font-bold text-on-background text-lg">Décoration Sur-Mesure</h4>
                <p className="text-on-surface-variant">
                  Un catalogue soigneusement sélectionné pour habiller chaque espace avec raffinement.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="material-symbols-outlined text-primary text-3xl">auto_awesome</span>
              <div>
                <h4 className="font-bold text-on-background text-lg">Excellence & Passion</h4>
                <p className="text-on-surface-variant">
                  Chaque projet est une page blanche écrite selon votre histoire et vos aspirations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
