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
- Sauvegarde : la forme des données change (comptes + accountId) → META_SCHEMA_VERSION passe à 2. Migration v1 → v2 (migrateV1toV2) : aucun compte (accounts: []), accountId: null partout.
- Virement interne (LDD, Livret A, PEA…) = une opération avec un accountId. Pas de type "transfer" séparé.

### Raffinements / idées

- Erreurs de la modale affichées sous chaque champ (un state d'erreur par champ)
- Extraire la logique pure de handleSubmit hors du composant (validation, construction des objets)
- Factoriser les deux modales (OperationFormModal / EditModal) et leur CSS identique
- Noms à harmoniser : updatedRules (contient une seule règle), accend → accent dans tokens.css
- Variante de suppression : supprimer la règle mais garder l'opération du mois en cours (selon les retours utilisateurs)
- Image d'aperçu Open Graph 1200 × 630 (og:image actuel à corriger ou à retirer)
- Fusion de fichiers JSON, avec détection des conflits : demander à l'utilisateur quelle opération garder (ex : salaire à 1500 dans l'app, à 1700 dans le JSON).
- Export CSV des opérations (une ligne par opération + colonne mois), pour l'analyse dans un tableur, pas pour la sauvegarde.
- Ajustement bancaire : au début d'un mois (ou à la première ouverture du mois), PROPOSER de saisir le solde réel de la banque, afficher l'écart et créer une opération d'ajustement si l'utilisateur accepte. Jamais automatique (un ajustement cache la cause de l'écart : abonnement oublié, règle fausse…). Opération identifiable (libellé « Ajustement », éventuellement origin "adjustment" → nouvelle version du format de sauvegarde).

### Refactor prévu (avant la V1.5)

- Découper validateObjectImport (validateMeta, validateStructure, validateMonths)
- Footer : lastSave calculé avec useMemo + dataVersion (supprimer le setLastSave manuel)
- Après import : remplacer le rechargement par une key sur les Routes (version des données) ou un state remonté
- Remplacer alert / window.confirm de l'import par une modale de l'app
- Renommer MAX_MONTHS_TO_GENERATE (sert aussi à la lecture)
- outline-offset sur la règle :focus-visible globale
- Mettre à jour ESLint pour la vulnérabilité modérée de minimatch (sans npm audit fix --force)

---

## V1.2 — Mois passés et grille des années (branche feat/month-history)

### Décisions

- **Navigation dans les années :** de l'année de firstMonth jusqu'à l'année en cours. Les années avant firstMonth n'existent pas ; les années futures sont grisées et non navigables. Bouton « année précédente » désactivé sur l'année de firstMonth.
- **États d'un mois dans la grille** (getMonthState dans utils/dates.js, valeurs dans MONTHS_STATE) :
  - "before" : avant firstMonth, n'existe pas (gris foncé), non cliquable
  - "past" : entre firstMonth et le mois en cours, cliquable
  - "current" : mois en cours (vert), cliquable, aria-current="date" + indice textuel, pas seulement la couleur
  - "future" : après le mois en cours (gris clair), non cliquable (pas de lien du tout)
- **Routes :** "/" redirige vers "/month" (Navigate replace) en attendant le dashboard ; "/month" = mois en cours ; "/month/:monthKey" = mois passé ; "/calendar" = grille de l'année (noms à revoir en fin de branche : Years / /calendar / « Années »).
- **Page d'un mois passé protégée :** format invalide (isMonthKey, mois 01 à 12) → 404 ; mois en cours → redirection vers /month ; tout ce qui n'est pas "past" → 404. Ne jamais faire confiance à l'URL.
- **Deux pages distinctes :** CurrentMonth et PastMonths (réutilisation de MonthSummary, OperationList). Les opérations d'un mois passé sont LUES dans le stockage (jamais recalculées avec materializeRules : le passé est figé).
- **Affichage d'un mois passé :** solde cumulé + report (comme le mois en cours) ; le total du mois est sous chaque liste.
- **Modification du passé — EXCEPTION VOLONTAIRE à « le passé ne bouge jamais » :** cette règle concerne les RÈGLES. Dans un mois passé, on peut AJOUTER et SUPPRIMER des opérations PONCTUELLES (origin "manual").
- **Opérations issues de règles d'un mois passé : intouchables.** Pour corriger un montant (facture qui varie, prélèvement différent), ajouter une opération ponctuelle de compensation (principe de l'écriture de correction en comptabilité). Question ouverte : autoriser la suppression d'une opération de règle (prélèvement non passé, abonnement suspendu).
- **Pas de modification d'une opération ponctuelle pour l'instant :** supprimer puis ajouter de nouveau couvre le besoin. À reconsidérer avec le modèle à dates (modifier montant ET date aurait alors du sens).
- Les reports et soldes étant CALCULÉS, corriger un mois passé met à jour automatiquement les mois suivants et le solde en cours : avertissement affiché dans la modale.

### Phase 1 — affichage seul

- [x] Route propre pour le mois en cours (/month)
- [x] Grille de l'année en cours avec les quatre états et les liens
- [ ] Navigation entre les années
- [x] Page d'un mois passé en lecture (résumé, report, opérations) ; OperationList : bouton de suppression optionnel (onDelete &&)

### Phase 2 — ajout / suppression

- [x] PastManualModal : libellé / montant / type, SANS la case « récurrente » (une règle créée depuis un mois passé ne se matérialiserait pas dans les mois déjà générés) ; la date viendra avec le modèle à dates
- [x] Avertissement en haut de la modale : changement du solde du mois, des mois suivants et du mois en cours
- [x] Suppression d'une opération ponctuelle avec confirmation (DeletePastConfirmation)
- [ ] CSS (grille, page du mois passé, modale, confirmation)

### À reprendre au refactor

- Factoriser les modales (OperationFormModal, EditModal, PastManualModal) et les confirmations (DeleteConfirmation, DeletePastConfirmation)
- PastMonths : rafraîchissement via useBudgetVersion plutôt que par un state voisin (fermeture de modale / confirmation)
- MonthSummary : la prop currentMonth désigne en fait le mois affiché (renommer)

---

## Modèle de données à dates (format de sauvegarde version 3)

### Pourquoi

Rapprochement avec le relevé bancaire (07/11/2026) : écart de −218,45 €, sans erreur de saisie. Causes :

- pas d'opération « solde de départ » (−663,49 €) → à saisir tout de suite, sans code ;
- règles de novembre comptées alors qu'elles n'étaient pas encore passées à la banque (+443,46 €) → l'app raisonne au MOIS, la banque au JOUR ;
- frais hors zone euro non suivis (+1,58 €) → réglé : règle CLAUDE passée à −23,18 €.
- deux opérations rangées dans le mauvais mois, faute de date.

### Décisions

- **Date sur les opérations :** `date: "YYYY-MM-DD"`. **Jour sur les règles :** `day` (1–31). Matérialisation : si le jour n'existe pas dans le mois (31 en février), on prend le dernier jour du mois.
- **Statut prévu / passé : CALCULÉ, jamais stocké** (date <= aujourd'hui → passé). Permet :
  - un solde « à ce jour » (proche de la banque, jamais garanti identique : délais de passage) ;
  - le prochain prélèvement ;
  - un solde de fin de mois prévisionnel (option).
  - Week-end : pas de décalage au jour ouvré pour commencer (un prélèvement du samedi apparaît « passé » avant la banque). À revoir si gênant.
- **Trois champs séparés, chacun une seule information :**

| Champ     | Question                                      | Valeurs                          |
| --------- | --------------------------------------------- | -------------------------------- |
| type      | Dans quel sens va l'argent ? (donne le signe) | "expense" / "income" (inchangé)  |
| origin    | D'où vient l'opération ?                      | "rule" / "manual" / "adjustment" |
| accountId | Mouvement vers l'épargne ?                    | null, ou id d'un compte (V3)     |

- **origin "adjustment" :** solde de départ et corrections de rapprochement. Exclus des statistiques de dépenses / revenus (sinon ils gonflent les revenus). Les mouvements avec accountId sont aussi exclus des stats, mais comptent dans le solde du compte courant.
- **Centimes en entiers (optionnel) :** si on le fait, le faire DANS cette même migration (une seule migration au lieu de deux). Formatage (÷ 100) uniquement à l'affichage. Les erreurs des flottants restent invisibles à l'affichage aujourd'hui : pas urgent.
- **Migration :** fonctions par étapes (migrateV1toV2 pour l'épargne, puis migrateV2toV3 pour les dates), enchaînées à l'import et au démarrage. Une sauvegarde v1 passe par toutes les étapes. Opérations sans date : date par défaut à décider (1er du mois ?). META_SCHEMA_VERSION → 3.
- La validation de l'import accepte les versions <= version actuelle (puis migre), et refuse les versions supérieures (sauvegarde d'une app plus récente).

### Plus tard

- Case « pointé » sur les opérations (seul moyen d'une égalité stricte avec la banque)
- Import du CSV bancaire avec rapprochement automatique (même montant à quelques centimes près, date à ±5 jours)

---

## Feuille de route — novembre 2026 (réordonnée le 09/11)

1. **V1.2 historique, phase 1 :** grille des années, routes, page d'un mois passé en lecture — presque fini (reste : afficher le résumé et les opérations du mois passé)
2. **V1.2 historique, phase 2 :** modifier le montant / ajouter des opérations ponctuelles dans un mois passé (modale sans date pour l'instant)
3. **Épargne :** comptes + accountId, page /savings, format de sauvegarde version 2, migrateV1toV2 — objectif : fini ou presque vers le 23/11
4. **Modèle à dates :** dates et jours, statut calculé, solde à ce jour, origin "adjustment", centimes (si retenu), format version 3, migrateV2toV3 ; ajouter le champ date à la modale des mois passés
5. **Plus tard :** pointage, import CSV bancaire, ajustement bancaire proposé en début de mois

Une étape mergée avant de commencer la suivante. Si ça déborde : mieux vaut une étape solide qu'une étape bâclée.
Sans code, tout de suite : ajouter l'opération « solde de départ » dans le premier mois.

---

## Option BDD

- Base de données : Supabase (données + authentification), front sur Vercel, réécriture de storage.js uniquement
- Profil utilisateur via Context, données serveur via TanStack Query
- Option C : matérialisation à la volée avec notion de mois clos, pour que les modifs de règles se reflètent sur les mois non clos
- Numéro de version du schéma de données, pour les migrations
