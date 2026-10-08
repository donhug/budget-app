## Finitions avant déploiement

### Logique
- [ ] Règle commencée : interdire une date de fin antérieure au mois en cours
- [ ] Vider les éventuels avertissements restants dans la console

### Textes et cohérence
- [ ] Relecture des libellés : accents, singulier/pluriel ("supprimer l'opération", "Total : ...")
- [ ] Montants formatés en euros (1 240,50 €) partout
- [ ] Messages vides homogènes ("Aucune règle", "Aucune opération")

### Accessibilité
- [ ] Hiérarchie des titres (h1 → h2 → h3) cohérente sur chaque page
- [ ] Boutons sans texte (le "X" des modales) : un aria-label
- [ ] Modales : fermeture avec la touche Échap, focus placé dans la modale à l'ouverture
- [ ] Contrastes des couleurs (vert/rouge sur fond sombre)
- [ ] Navigation au clavier sur toute l'app (Tab)
- [ ] Audit Lighthouse (accessibilité + performance)

### Style
- [ ] Icônes (navigation, boutons modifier / supprimer)
- [ ] Style de la page 404 et du loader
- [ ] MonthPicker harmonisé avec les autres champs
- [ ] Vérification mobile + desktop de chaque page
- [ ] Test sur Firefox, Chrome, Safari si possible

### Avant la mise en ligne
- [ ] Footer
- [ ] Titre de l'onglet, favicon, meta description
- [ ] vercel.json (redirection des routes vers index.html)
- [ ] README du dépôt : présentation, captures, choix techniques (vitrine pour ton portfolio)