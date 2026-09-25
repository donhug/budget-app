# budget-app — Notes de conception

## Modèle de données — décisions

- Modèle B : les mois sont CHAÎNÉS. Le solde d'un mois prend en compte
  le report du mois précédent.

- SOURCE DE VÉRITÉ = les opérations saisies + les règles + le solde initial.
  Tout le reste (totaux, reports, soldes de fin de mois) est CALCULÉ,
  jamais stocké.

- UNE SEULE valeur de solde stockée : le solde initial (racine).
  C'est l'argent présent au démarrage de l'app.

- RÈGLES (loyer, paye, crédit, abonnements) = opérations qui se répètent,
  avec une date de début et une date de fin optionnelle.

- Une règle se MATÉRIALISE en opération à la naissance d'un mois.
  Une fois matérialisée, l'opération appartient au mois (passé FIGÉ).

- Modifier une règle = effet sur les mois FUTURS uniquement.
  LE PASSÉ NE BOUGE JAMAIS. Seul le mois en cours peut être mis à jour,
  et seulement si l'utilisateur le demande (case à cocher).

- `ruleId` sur une opération = TRACE d'origine, jamais un lien vivant.
  Ne jamais s'en servir pour mettre à jour les opérations en masse.

- Report affiché en sous-texte, CALCULÉ depuis le solde du mois précédent.

## Formes de données

- Opération : { id, ruleId, label, value, type, origin }
  - value SIGNÉ (négatif = dépense)
  - type : "expense" | "income"
  - origin : "rule" | "manual"
  - ruleId : id de la règle d'origine, ou null si saisie manuelle

- Règle : { id, label, value, type, start, end }
  - start / end au format "YYYY-MM", end = null si sans fin

- Clés localStorage :
  - "rules", "initialBalance", "firstMonth", "lastMonth"
  - "operations-YYYY-MM" (une clé par mois)

- Format de mois "YYYY-MM" : se compare et se trie directement en chaîne.
  Formaté en clair ("septembre 2026") uniquement à l'affichage.

## Architecture

- services/storage.js : seule couche qui touche au localStorage
  (à réécrire seule le jour du passage à une BDD)
- services/budget.js : calculs métier (total, solde récursif,
  matérialisation, génération des mois)
- utils/dates.js : outils de mois
- constants/ : NAV_LINKS, MONTHS
- pages/ : CurrentMonth ("/"), ChangesRules ("/rules-changes"),
  UnderConstruction (dashboard, savings, account), NotFound ("*")
- components/ : MonthSummary, OperationList, OperationFormModal,
  DeleteConfirmation, MonthPicker, Sidebar, MobileNav, Header
- App : layout + routes + génération des mois au démarrage (état isReady),
  les pages ne s'affichent qu'une fois la génération terminée

## Fait

- Saisie : modale unique, case "récurrente", dates de début/fin, validation
  groupée des erreurs, montant normalisé (le signe vient du type)
- Suppression : opération ponctuelle directe ; opération de règle avec
  choix "juste ce mois-ci" / "supprimer la règle" / "annuler"
- Report masqué sur le mois racine
- Mois affichés en clair
- generateMonths blindé : sortie si lastMonth >= mois courant,
  et ne régénère jamais un mois qui contient déjà des opérations
- Navigation React Router, page active en surbrillance, page 404
- MonthPicker (deux <select>) : remplace <input type="month">,
  non supporté par Firefox desktop

## V1 — reste à faire

- toMonthKey / parseMonthKey dans dates.js (assembler / découper "YYYY-MM"),
  puis les utiliser partout où le code est dupliqué
- MonthPicker pour la date de fin + case "sans date de fin"
- Page Modifications : lister TOUTES les règles (y compris futures et
  terminées), les modifier avec la case "inclure le mois en cours"
- vercel.json : rediriger toutes les routes vers index.html (sinon 404
  au rechargement d'une page comme /savings)
- Footer (dans le layout, hors du ternaire isReady)

## V1.1 — Épargne (page /savings)

- Entité compte : { id, name, initialBalance } (Livret A, jeune, LDD, PEL...)
- Opérations et règles avec un accountId optionnel :
  négatif = versement vers le compte, positif = retrait depuis le compte
- Solde d'un compte CALCULÉ : solde initial + tous ses mouvements,
  sur tous les mois de la racine au mois courant

## Raffinements / idées

- Afficher les prélèvements à venir (en juin, signaler qu'un crédit
  démarre en août)
- Erreurs de la modale affichées sous chaque champ plutôt qu'un
  message global (un state d'erreur par champ)
- Extraire la logique pure de handleSubmit hors du composant
  (validation, construction des objets)
- Variante de suppression : supprimer la règle mais garder l'opération
  du mois en cours (à voir selon les retours utilisateurs)
- Montants formatés en euros avec décimales (1 240,50 €)
- Export / import JSON des données (filet contre la perte du localStorage)

## V2

- Base de données : Supabase (données + authentification), front sur Vercel,
  réécriture de storage.js uniquement
- Profil utilisateur via Context, données serveur via TanStack Query
- Option C : matérialisation à la volée avec notion de mois clos,
  pour que les modifs de règles se reflètent sur les mois non clos
- Numéro de version du schéma de données, pour les migrations