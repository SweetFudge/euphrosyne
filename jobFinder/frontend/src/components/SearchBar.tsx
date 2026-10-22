interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <input
      type="search"
      placeholder="Rechercher un poste ou une entreprise…"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{ width: '100%', padding: '0.6rem', marginBottom: '1rem' }}
    />
  )
}
