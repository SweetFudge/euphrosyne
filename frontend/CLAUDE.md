# CLAUDE.md — Frontend

## Règle obligatoire — Feedback visuel sur les actions asynchrones

Toute action déclenchée par l'utilisateur qui appelle un endpoint (mutation ou lecture lente) **doit** afficher un retour visuel pendant la durée de la requête. L'utilisateur ne doit jamais se demander si son clic a été pris en compte.

### Quand appliquer cette règle

- Bouton de soumission de formulaire (création, modification)
- Action sur une carte/miniature (définir comme couverture, changer un statut)
- Upload de fichier
- Suppression avec confirmation
- Tout appel `await` déclenché par une interaction utilisateur

### Patterns à utiliser selon le contexte

#### Bouton de soumission
Désactiver le bouton et remplacer le label par un texte d'attente :
```tsx
<button type="submit" disabled={saving}>
  {saving ? 'Enregistrement...' : 'Enregistrer'}
</button>
```

#### Action sur une miniature / carte
Afficher un voile sombre avec un spinner centré par-dessus l'élément concerné. Désactiver les autres boutons de la carte pendant ce temps :
```tsx
const [coverLoading, setCoverLoading] = useState<number | null>(null) // stocke l'id en cours

// dans le JSX de la miniature :
{coverLoading === photo.id && (
  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
    <span className="material-symbols-outlined animate-spin text-white text-2xl">progress_activity</span>
  </div>
)}

// boutons désactivés pendant le chargement :
<button disabled={coverLoading !== null} className="... disabled:opacity-50">
```

#### Upload de fichiers multiples
Afficher la progression fichier par fichier :
```tsx
const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number } | null>(null)

// label du bouton :
{uploadProgress ? `${uploadProgress.current} / ${uploadProgress.total} envoyées…` : 'Ajouter des photos'}
```

#### Page entière en chargement
Centrer un spinner sur fond `bg-background` :
```tsx
<div className="min-h-screen bg-background flex items-center justify-center">
  <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
</div>
```

### Règles générales

- Toujours utiliser `try/finally` pour garantir la réinitialisation de l'état de chargement même en cas d'erreur
- Stocker l'identifiant de l'élément en cours (`number | null`) plutôt qu'un simple booléen dès qu'il y a plusieurs éléments dans une liste
- Utiliser `disabled:opacity-50` pour signaler visuellement qu'un bouton est inactif
- L'icône de spinner à utiliser est `progress_activity` (Material Symbols) avec la classe Tailwind `animate-spin`