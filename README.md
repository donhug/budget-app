# Budget App

Application de gestion de budget mensuel développée avec **React et Vite**. Elle permet de saisir ses dépenses et ses revenus, de gérer des opérations récurrentes et de suivre un solde qui se reporte d’un mois à l’autre.

Ce projet personnel s’inscrit dans une démarche d’apprentissage : construire une application concrète pour approfondir React, JavaScript, la gestion de l’état et l’organisation de la logique métier.

> **Projet en cours de développement.** Le suivi du mois courant est implémenté. Certaines rubriques de navigation sont encore en construction.

## Fonctionnalités actuelles

- Affichage du mois courant, de son solde et du report du mois précédent.
- Ajout de dépenses et de revenus ponctuels.
- Création d’opérations récurrentes avec un mois de début et un mois de fin facultatif.
- Affichage séparé des opérations récurrentes et ponctuelles, avec leurs totaux.
- Suppression d’une opération ponctuelle.
- Pour une opération récurrente : suppression uniquement pour le mois courant, ou suppression de la règle et de son opération du mois courant.
- Génération des mois manquants au démarrage de l’application, à partir des règles enregistrées.
- Conservation des données dans le navigateur avec `localStorage`.
- Interface responsive avec navigation latérale sur grand écran et menu sur mobile.
- Thème clair ou sombre selon les préférences du système.

## Technologies

| Technologie | Utilisation |
| --- | --- |
| React 19 | Composants et gestion de l’état |
| JavaScript | Interface et logique métier |
| Vite 8 | Serveur de développement et compilation |
| React Router | Navigation entre les pages |
| CSS Modules | Styles propres aux composants |
| Variables CSS | Couleurs, espacements et thèmes |
| localStorage | Stockage local des données |
| ESLint | Analyse statique du code |

## Installation et lancement

### Prérequis

- Node.js dans une version compatible avec les dépendances du projet, notamment Vite 8 et ESLint 10.
- npm.
- Une copie du dépôt, sur la branche à utiliser.

L’application React se trouve dans **`Compte/`**. Depuis la racine du dépôt, exécuter :

```sh
cd Compte
npm install
npm run dev
```

Ouvrir ensuite l’adresse indiquée par Vite dans le terminal.

La version actuelle utilise uniquement le stockage du navigateur : aucun serveur de données, compte utilisateur ou clé API n’est nécessaire.

### Commandes disponibles

Toutes ces commandes s’exécutent depuis `Compte/`.

| Commande | Description |
| --- | --- |
| `npm run dev` | Démarrer le serveur de développement |
| `npm run build` | Générer la version de production dans `dist/` |
| `npm run preview` | Prévisualiser localement la version compilée |
| `npm run lint` | Analyser le code avec ESLint |

Aucune commande de tests automatisés n’est actuellement configurée dans l’application React.

## Utilisation

1. Ouvrir la page **En Cours**.
2. Cliquer sur **Ajouter**.
3. Renseigner un libellé, un montant et la nature de l’opération : dépense ou entrée.
4. Pour une opération mensuelle, cocher **Opération récurrente**, puis choisir sa période d’application. Une date de fin vide correspond à une récurrence sans fin définie.
5. Valider pour actualiser les opérations et le solde du mois si l’opération s’applique à celui-ci.

Une règle dont le début est futur sera utilisée lors de la génération des mois concernés.

## Fonctionnement du budget

### Report du solde

Les mois sont liés entre eux : le solde d’un mois correspond au solde précédent, augmenté des revenus et diminué des dépenses du mois.

Au premier lancement, le solde initial est fixé à **0 €**. Son réglage dans l’interface n’est pas encore implémenté.

Les totaux et les soldes sont calculés à partir des opérations enregistrées ; ils ne sont pas sauvegardés comme des valeurs indépendantes.

### Opérations récurrentes

Une règle représente une dépense ou un revenu à répéter chaque mois, par exemple un loyer, un abonnement ou un salaire.

Lorsqu’un mois est généré, les règles applicables deviennent des opérations propres à ce mois. Supprimer une règle n’efface donc pas les opérations déjà enregistrées dans les mois passés.

### Stockage local

Les règles, les opérations mensuelles et les informations d’initialisation sont enregistrées dans le `localStorage` du navigateur.

Les données restent liées au navigateur et à l’adresse utilisés. Elles ne sont pas synchronisées entre appareils. Effacer les données du site peut les supprimer ; l’export et l’import ne sont pas encore disponibles.

## Organisation du projet

```text
Compte/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx          # Point d’entrée React et routeur
    ├── App.jsx           # Mise en page, routes et initialisation
    ├── components/      # Formulaire, listes, résumé, navigation…
    ├── pages/           # Pages de l’application
    ├── services/
    │   ├── budget.js    # Calculs, récurrences et génération des mois
    │   └── storage.js   # Accès au localStorage
    ├── utils/           # Manipulation et affichage des mois
    ├── constants/       # Noms des mois et liens de navigation
    └── styles/          # Variables CSS et thèmes
```

L’interface, les calculs métier et l’accès au stockage sont séparés pour faciliter la compréhension et l’évolution du projet.

## État des pages

| Page | État actuel |
| --- | --- |
| En Cours — `/` | Suivi et saisie des opérations du mois courant |
| Modifications — `/rules-changes` | Page amorcée ; édition des règles à développer |
| Dashboard — `/dashboard` | En construction |
| Épargne — `/savings` | En construction |
| Compte — `/account` | En construction |

Une page 404 est prévue pour les adresses non reconnues. La consultation des mois passés n’est pas encore proposée dans l’interface.

## Évolutions envisagées

- Lister et modifier les règles récurrentes, y compris celles à venir ou terminées.
- Permettre de choisir si une modification de règle s’applique aussi au mois courant.
- Améliorer la saisie des dates et l’affichage des montants en euros.
- Ajouter la gestion de comptes d’épargne et de leurs mouvements.
- Proposer un export et un import JSON des données.
- À plus long terme, étudier une base de données et une authentification avec Supabase.

Ces éléments sont des pistes de développement et ne sont pas disponibles dans la version actuelle.

## Déploiement

La compilation produit une application statique dans `Compte/dist/`.

L’application utilise `BrowserRouter` : l’hébergement doit renvoyer les routes de l’application vers `index.html` pour permettre l’ouverture directe ou le rechargement d’une page comme `/savings`.
