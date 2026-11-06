# HF-Budget — Notes de conception

## Le projet

Application de gestion de budget mois par mois

- En ligne : https://hf-budget.vercel.app (Vercel, dossier racine Compte)
- Stack : React 19, Vite, React Router v7, CSS Modules, localStorage, Vercel (Web Analytics)
- Workflow : une branche par fonctionnalité + Pull Request vers main, Conventional Commits (feat, fix, refactor, docs, style, chore, perf)
- main = production : chaque merge est déployé automatiquement
- Chaque branche poussée a un déploiement de prévisualisation sur Vercel : tester dessus avant de merger
- Après un merge : git switch main, git pull, git fetch --prune, git branch -d `<branche>`
- Formatage : Prettier installé dans le projet (`npm run format`), lint avec `npm run lint`

## Modèle de données — décisions

- Modèle B : les mois sont CHAÎNÉS. Le solde d'un mois prend en compte le report du mois précédent.
- SOURCE DE VÉRITÉ = les opérations saisies + les règles. Tout le reste (totaux, reports, soldes de fin de mois) est CALCULÉ, jamais stocké.
- Le solde initial est volontairement à 0 : l'app suit un budget, pas le relevé exact d'un compte. Pour partir d'une somme existante, l'utilisateur ajoute une opération ponctuelle « solde de départ » en entrée. La clé initialBalance reste stockée (toujours à 0) pour garder la porte ouverte.
- RÈGLES (loyer, paye, crédit, abonnements) = opérations qui se répètent, avec une date de début et une date de fin optionnelle.
- Une règle se MATÉRIALISE en opération à la naissance d'un mois. Une fois matérialisée, l'opération appartient au mois (passé FIGÉ).
- Modifier une règle = effet sur les mois FUTURS uniquement. LE PASSÉ NE BOUGE JAMAIS. Seul le mois en cours peut être mis à jour, et seulement si l'utilisateur le demande (case « inclure le mois en cours »).
- Cas particulier délibéré : quand une règle à venir est avancée au mois en cours, son opération est créée automatiquement pour ce mois.
- Les règles terminées sont affichées mais pas modifiables (choix délibéré).
- ruleId sur une opération = TRACE d'origine, jamais un lien vivant. Ne jamais s'en servir pour mettre à jour les opérations en masse.
- Report affiché en sous-texte, CALCULÉ depuis le solde du mois précédent.

## Formes de données

- Opération : { id, ruleId, label, value, type, origin }
- value SIGNÉ (négatif = dépense)
- type : "expense" | "income"
- origin : "rule" | "manual"
- ruleId : id de la règle d'origine, ou null si saisie manuelle
- Règle : { id, label, value, type, start, end }
- start / end au format "YYYY-MM", end = null si sans fin
- **Clés localStorage :**
  - "rules", "initialBalance", "firstMonth", "lastMonth"
  - "operations-YYYY-MM" (une clé par mois)
  - "lastSave" : date ISO de la dernière sauvegarde (export ou import). Information d'interface, pas une donnée budgétaire : non exportée. Ne jamais renommer une clé déjà en production sans migration.
- Format de mois "YYYY-MM" : se compare et se trie directement en chaîne. Formaté en clair (« septembre 2026 ») uniquement à l'affichage.

### Fichier de sauvegarde (export / import)

```
{
  "meta": {
    "app": "HF-Budget",
    "schemaVersion": 1,
    "exportedAt": "2026-10-19T22:58:00.000Z"
  },
  "rules": [ { id, label, value, type, start, end }, ... ],
  "initialBalance": 0,
  "firstMonth": "2026-09",
  "lastMonth": "2026-10",
  "months": {
    "2026-09": [ { id, ruleId, label, value, type, origin }, ... ],
    "2026-10": [ ... ]
  }
}
```

- Reflète le localStorage : règles une seule fois à la racine, uniquement des opérations dans les mois. Aucune valeur calculée.
- schemaVersion (META_SCHEMA_VERSION) = version de la FORME DES DONNÉES, pas de l'app. Ne change que si la structure change (épargne, V2…). La version de l'app est VERSION_APP (affichée dans le footer).
- Import = REMPLACEMENT (pas de fusion) : validation « tout ou rien » avant toute écriture, proposition d'exporter les données actuelles, confirmation avec la date de la sauvegarde, puis rechargement de la page.

## Architecture

- services/storage.js : seule couche qui touche au localStorage (à réécrire seule le jour du passage à une BDD)
- getRules / setRules(rules), getOperations(month) / setOperations(month, ops), getInitialBalance / setInitialBalance, getFirstMonth / setFirstMonth, getLastMonth / setLastMonth, deleteRule(ruleId), deleteOperation(month, operationId)
- replaceAllData(data) : efface toutes les clés "operations-*" puis écrit la sauvegarde (data déjà validé)
- setLastBackup / getLastBackup : date de la dernière sauvegarde (clé "lastSave")
- notifyBudgetUpdated : chaque setter budgétaire diffuse l'événement "budget-updated" (BUDGET_UPDATED_EVENT) APRÈS l'écriture
- services/budget.js : getMonthTotal, getBalance (récursif, renvoie 0 si firstMonth absent), materializeRules, generateMonths (plafond 120 mois), groupRulesByStartMonth, getAllOperationsByMonth, getSquirrelMood, getBiggestExpense
- services/backup.js : buildObjectExport (objet de sauvegarde), validateObjectImport (renvoie un message d'erreur ou null)
- utils/dates.js : getCurrentMonth, getNextMonth, getPreviousMonth, formatMonth, toMonthKey, parseMonthKey, isMonthKey (regex), getYearsOption(startYear), startOfDay, getDaysSince (jours de calendrier), getSaveLabel
- utils/format.js : formatBalance, qui formate TOUS les montants en euros (Intl.NumberFormat fr-FR)
- utils/checks.js : isPlainObject (objet, non null, pas un tableau)
- utils/downloadObject.js : downloadObject(data, fileName), générique (Blob + lien temporaire)
- hooks/ : useClock (heure mise à jour chaque seconde), useBudgetVersion (compteur incrémenté à chaque "budget-updated")
- constants/ : NAV_LINKS, MONTHS, META_APP / META_SCHEMA_VERSION, VERSION_APP, ERROR_* (messages d'import), BUDGET_UPDATED_EVENT, PROVERBS, SQUIRREL_MOODS
- pages/ : CurrentMonth ("/"), ChangesRules ("/rules-changes"), UnderConstruction (dashboard, savings, account), NotFound ("\*")
- components/ : MonthSummary, OperationList, OperationFormModal, DeleteConfirmation, MonthPicker, Sidebar, MobileNav, Header, Footer, RuleList, EditModal, ScrollBubble
- App : layout + routes + génération des mois au démarrage (état isReady). Les pages ET le Footer ne s'affichent qu'une fois la génération terminée : ils initialisent leurs states depuis le stockage (fonction d'initialisation de useState).

## Patterns utilisés

- Props vers le bas, callbacks vers le haut
- Bouton optionnel affiché seulement si sa prop est fournie (onEdit &&, onDelete &&, onDeleteOperation &&)
- Un state qui contient l'objet sélectionné sert aussi de signal ouvert / fermé (ruleToEdit, ruleToDelete, operationToDelete)
- Retours anticipés : chaque `if` teste le mauvais cas et sort avec son message (validateObjectImport, handleImport)
- Recalcul sur changement de données : useBudgetVersion fournit dataVersion, utilisé comme dépendance de useMemo (Footer)
- utils/ génériques (ne connaissent pas le budget) ; services/ connaissent le modèle ; la base (budget.js) ne dépend pas des fonctionnalités (backup.js)

---

## Fait — V1 (terminée et en ligne)

### Fonctionnalités

- Saisie : modale unique, case « récurrente », dates de début / fin, validation groupée des erreurs, montant normalisé (le signe vient du type)
- Saisie ponctuelle : les dates de récurrence masquées ne bloquent plus la validation
- Suppression : opération ponctuelle directe ; opération de règle avec choix « juste ce mois-ci » / « supprimer la règle » / « annuler »
- Report masqué sur le mois racine ; mois affichés en clair
- Montants formatés en euros avec décimales (1 240,50 €)
- generateMonths blindé : sortie si lastMonth >= mois courant, ne régénère jamais un mois qui contient déjà des opérations, plafond de 120 mois
- Navigation React Router, page active en surbrillance, page 404 avec lien de retour
- MonthPicker (deux `<select>`) : remplace `<input type="month">`, non supporté par Firefox desktop ; date de fin optionnelle
- toMonthKey / parseMonthKey : assembler / découper "YYYY-MM"
- **Page Modifications :**
  - règles actives / à venir (groupées par mois de début) / terminées
  - modification et suppression des règles actives et à venir
  - case « inclure le mois en cours » pour les règles déjà commencées
  - choix « juste ce mois-ci » à la suppression d'une règle commencée
  - règle commencée : date de fin antérieure au mois en cours interdite
- Footer : avertissement « données stockées uniquement dans ce navigateur »

### Qualité et mise en ligne

- Lint à zéro (une exception documentée dans App)
- vercel.json : toutes les routes redirigées vers index.html
- SEO : title, meta description, lang="fr", robots.txt, Open Graph, JSON-LD
- Favicon + icône iPhone (PNG), images en WebP
- Lighthouse mobile 100 partout (tester sur npm run build + npm run preview, en navigation privée)
- WAVE : 9,7
- Vercel Web Analytics

---

## Fait — V1.1

### Sauvegarde

- Export JSON : bouton « Sauvegarder » dans le footer, fichier daté hf-budget-YYYY-MM-DD.json, date de dernière sauvegarde affichée
- Import JSON : JSON.parse protégé (try/catch), validation complète (origine, version du format, structure, chaque mois et chaque opération), proposition d'exporter avant, confirmation, remplacement, rechargement
- Message du footer : rappel de sauvegarder régulièrement

### Footer

- Nouvelle mise en page : horloge, compteur de mois, dernière sauvegarde, coin de l'écureuil (humeur, plus grosse dépense, proverbe), version de l'app
- Bulle flottante : aller à la sauvegarde / revenir en haut

### Corrections et refactor (revue de code)

- Plus de plantage au premier lancement : Footer derrière isReady + getBalance renvoie 0 sans firstMonth
- MonthPicker : la liste des années inclut toujours l'année de la valeur affichée (échéance du 1er janvier 2027 réglée)
- EditModal : la date de fin proposée n'est plus dans le passé
- Dernière sauvegarde : jours de calendrier (startOfDay) au lieu de tranches de 24 h
- Focus clavier visible partout (:focus-visible global + bouton « Importer ») ; nom accessible de la bulle = texte visible
- getAllOperationsByMonth déplacé dans budget.js ; humeurs de l'écureuil dans les constantes ; tous les setters budgétaires notifient
- Prettier installé ; vulnérabilités hautes (vite, zod) corrigées par npm audit fix

---

## V1.1 — reste à faire

### Robustesse

- **generateMonths :**
  - si le plafond de 120 est atteint, ne pas marquer lastMonth sur le mois courant (les mois manquants ne seraient jamais rattrapés)
  - si seule la clé lastMonth manque, ne pas écraser les données existantes
- Changement de mois avec l'app ouverte (la génération n'a lieu qu'au démarrage)
- try/catch dans storage.js : lecture corrompue (JSON invalide), écriture impossible (stockage plein ou indisponible)
- Modales : annuler les temporisations si la modale est fermée pendant l'animation de validation
- « Inclure le mois en cours » sans effet si l'opération du mois a été supprimée : le signaler ou masquer la case
- Classes CSS référencées mais inexistantes dans les modales (heading, typeGroup, error)

### Accessibilité

- Modales : fermeture par Échap, focus placé dans la modale puis restauré, rôle dialog
- Labels des `<select>` du MonthPicker (mois / année, début / fin)
- Focus visible sur les boutons radio Dépense / Entrée
- Contrastes signalés par WAVE (boutons en thème sombre)
- Erreurs de formulaire annoncées ; bouton « X » nommé (« Fermer »)
- Message « Aucune opération » dans OperationList (comme RuleList)
- Libellés longs sans espace : gérer la coupure (mobile)

### Fonctionnalités

- Mention « non appliquée au mois en cours » pour les règles actives sans opération ce mois-ci
- Champ de fréquence pour les règles (mensuelle, trimestrielle, annuelle…)

### Épargne (page /savings)

- Entité compte : { id, name, initialBalance } (Livret A, jeune, LDD, PEL…)
- Opérations et règles avec un accountId optionnel : négatif = versement vers le compte, positif = retrait depuis le compte
- Solde d'un compte CALCULÉ : tous ses mouvements, sur tous les mois de la racine au mois courant

### Raffinements / idées

- Erreurs de la modale affichées sous chaque champ (un state d'erreur par champ)
- Extraire la logique pure de handleSubmit hors du composant (validation, construction des objets)
- Factoriser les deux modales (OperationFormModal / EditModal) et leur CSS identique
- Noms à harmoniser : updatedRules (contient une seule règle), accend → accent dans tokens.css
- Variante de suppression : supprimer la règle mais garder l'opération du mois en cours (selon les retours utilisateurs)
- Image d'aperçu Open Graph 1200 × 630 (og:image actuel à corriger ou à retirer)
- Fusion de fichiers JSON, avec détection des conflits : demander à l'utilisateur quelle opération garder (ex : salaire à 1500 dans l'app, à 1700 dans le JSON).
- Export CSV des opérations (une ligne par opération + colonne mois), pour l'analyse dans un tableur, pas pour la sauvegarde.
- Page avec les mois de l'année : mois déjà générés cliquables (route /month/:monthKey + useParams), mois à venir grisés.
  À décider : mois passé en lecture seule ou modifiable (si modifiable, cela change les reports et donc le solde du mois en cours).

### Refactor prévu (avant la V1.5)

- Découper validateObjectImport (validateMeta, validateStructure, validateMonths)
- Footer : lastSave calculé avec useMemo + dataVersion (supprimer le setLastSave manuel)
- Après import : remplacer le rechargement par une key sur les Routes (version des données) ou un state remonté
- Remplacer alert / window.confirm de l'import par une modale de l'app
- Renommer MAX_MONTHS_TO_GENERATE (sert aussi à la lecture)
- outline-offset sur la règle :focus-visible globale
- Mettre à jour ESLint pour la vulnérabilité modérée de minimatch (sans npm audit fix --force)

---

## V2

- Base de données : Supabase (données + authentification), front sur Vercel, réécriture de storage.js uniquement
- Profil utilisateur via Context, données serveur via TanStack Query
- Option C : matérialisation à la volée avec notion de mois clos, pour que les modifs de règles se reflètent sur les mois non clos
- Numéro de version du schéma de données, pour les migrations
