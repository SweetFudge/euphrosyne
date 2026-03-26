const timeline = [
  {
    year: '2015',
    title: 'Les débuts',
    text: 'Sophie Beaumont crée Euphrosyne avec une conviction simple : chaque événement mérite d\'être unique. Les premiers mariages et fêtes privées révèlent un talent naturel pour transformer les espaces et les rêves en réalité.',
  },
  {
    year: '2017',
    title: 'Le catalogue',
    text: 'Forte de retours enthousiastes, Euphrosyne constitue son propre catalogue de matériel décoratif : arches, fleurs artificielles haut de gamme, linge de table. Une offre de location qui permet à chaque client de bénéficier d\'éléments d\'exception.',
  },
  {
    year: '2020',
    title: 'Résilience & Réinvention',
    text: 'Malgré les défis de la période, Euphrosyne adapte ses services, développe des formats intimes et raffine encore son offre. Cette période renforce la conviction que les émotions humaines méritent toujours d\'être célébrées.',
  },
  {
    year: '2024',
    title: 'Aujourd\'hui',
    text: 'Plus de 200 événements organisés. Un catalogue de décoration reconnu pour sa qualité. Une équipe soudée qui partage les mêmes valeurs d\'excellence et de passion. Euphrosyne continue d\'écrire sa belle histoire à vos côtés.',
  },
]

const values = [
  {
    icon: 'diamond',
    title: 'Excellence',
    description: 'Chaque détail compte. De la sélection du matériel à l\'installation finale, nous ne faisons aucun compromis sur la qualité.',
  },
  {
    icon: 'auto_awesome',
    title: 'Sur-Mesure',
    description: 'Pas de formule toute faite. Chaque événement est conçu spécialement pour vous, selon votre vision et votre personnalité.',
  },
  {
    icon: 'handshake',
    title: 'Confiance',
    description: 'Vous nous confiez l\'un des moments les plus importants de votre vie. Nous prenons cet honneur au sérieux, avec engagement et transparence.',
  },
  {
    icon: 'favorite',
    title: 'Passion',
    description: 'Ce métier est avant tout une vocation. La joie que nous voyons sur vos visages le jour J est notre plus belle récompense.',
  },
]

export default function Histoire() {
  return (
    <div className="pt-20">

      {/* Hero */}
      <section className="relative py-32 bg-surface-container-low overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1600&q=80"
            alt="Notre histoire"
            className="w-full h-full object-cover brightness-[0.3]"
          />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-12 text-center">
          <span className="text-primary-fixed font-label uppercase tracking-[0.2em] text-sm mb-6 block">
            Qui sommes-nous
          </span>
          <h1 className="font-headline text-5xl md:text-7xl text-white mb-8 leading-tight">
            Notre Histoire
          </h1>
          <p className="text-white/80 text-xl md:text-2xl font-light leading-relaxed max-w-2xl mx-auto">
            Une passion pour les belles choses, une expertise au service de vos émotions.
          </p>
        </div>
      </section>

      {/* La vision — fondatrice */}
      <section className="py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80"
                alt="Sophie Beaumont, fondatrice d'Euphrosyne"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-8 -right-8 bg-surface-container-lowest p-6 rounded-xl shadow-2xl max-w-xs">
              <p className="font-headline italic text-primary text-lg mb-3 leading-snug">
                "Euphrosyne, c'est la joie — celle que je veux offrir à chacun de mes clients."
              </p>
              <span className="text-on-surface-variant text-sm font-label uppercase tracking-widest">
                — Sophie Beaumont, Fondatrice
              </span>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <span className="text-primary font-label uppercase tracking-[0.2em] text-sm mb-4 block">
                La vision
              </span>
              <h2 className="font-headline text-4xl md:text-5xl text-on-background leading-tight mb-6">
                Une Organisatrice,<br />Une Artiste, Une Passionnée.
              </h2>
            </div>
            <p className="text-on-surface-variant text-lg leading-relaxed">
              Sophie Beaumont a toujours eu le goût du beau et le sens du détail. Après une formation en design d'intérieur et plusieurs années dans l'événementiel de luxe, elle fonde <strong>Euphrosyne</strong> en 2015 — du nom de la déesse grecque de la joie.
            </p>
            <p className="text-on-surface-variant text-lg leading-relaxed">
              Sa philosophie ? Que chaque célébration soit le reflet authentique de ceux qui la vivent. Pas de modèles imposés, pas de décoration générique — juste votre histoire, magnifiée.
            </p>
            <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-xl">
              <p className="text-on-background font-medium italic">
                "Je crois profondément que les moments de célébration sont précieux. Mon rôle est de les rendre inoubliables — avec soin, authenticité, et un peu de magie."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 bg-surface-container-low">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <span className="text-primary font-label uppercase tracking-[0.2em] text-sm mb-4 block">
              Notre parcours
            </span>
            <h2 className="font-headline text-4xl md:text-5xl text-on-background">
              D'hier à aujourd'hui
            </h2>
          </div>
          <div className="relative">
            {/* Line */}
            <div className="absolute left-8 top-0 bottom-0 w-px bg-outline-variant hidden md:block" />
            <div className="space-y-12">
              {timeline.map(({ year, title, text }, index) => (
                <div key={year} className={`flex gap-8 ${index % 2 === 0 ? '' : 'md:flex-row-reverse'}`}>
                  <div className="flex-shrink-0 flex items-start pt-1">
                    <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center font-headline text-sm font-bold shadow-lg">
                      {year}
                    </div>
                  </div>
                  <div className="flex-1 bg-surface-container-lowest p-8 rounded-xl shadow-sm">
                    <h3 className="font-headline text-xl text-on-background mb-3">{title}</h3>
                    <p className="text-on-surface-variant leading-relaxed">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Valeurs */}
      <section className="py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <span className="text-primary font-label uppercase tracking-[0.2em] text-sm mb-4 block">
              Ce qui nous guide
            </span>
            <h2 className="font-headline text-4xl md:text-5xl text-on-background">
              Nos Valeurs
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map(({ icon, title, description }) => (
              <div key={title} className="text-center p-8 bg-surface-container-low rounded-2xl hover:bg-surface-container transition-colors group">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                  <span className="material-symbols-outlined text-primary text-3xl">{icon}</span>
                </div>
                <h3 className="font-headline text-xl text-on-background mb-3">{title}</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
