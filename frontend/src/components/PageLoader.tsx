export default function PageLoader({ visible }: { visible: boolean }) {
  return (
    <div
      className={`fixed inset-0 z-50 bg-background flex flex-col items-center justify-center gap-6 transition-opacity duration-500 ${
        visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <span className="font-headline text-3xl text-amber-900 tracking-tighter">Euphrosyne</span>
      <div className="flex gap-2">
        {[0, 1, 2].map(i => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
    </div>
  )
}