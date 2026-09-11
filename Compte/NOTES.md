## Modèle de données — décisions

- Modèle B : les mois sont CHAÎNÉS. Le solde d'un mois prend en compte
  le report du mois précédent.

- SOURCE DE VÉRITÉ = les opérations saisies + les règles + le solde initial.
  Tout le reste (totaux, reports, soldes de fin de mois) est CALCULÉ,
  jamais stocké.

- UNE SEULE valeur de solde stockée : le solde initial (racine, clé fixe
  "initialBalance"). C'est l'argent présent au démarrage de l'app.

- RÈGLES (loyer, paye, crédit, abonnements) = opérations qui se répètent.
  Avec ou sans date de fin (crédit sur 5 mois = avec fin).

- Une règle se MATÉRIALISE en opération à la naissance d'un mois.
  Une fois matérialisée, l'opération appartient au mois (passé FIGÉ).

- Modifier une règle = effet sur les mois FUTURS uniquement.
  Le passé ne bouge pas.

- Report affiché en sous-texte du mois ("reste de avril : X€"),
  mais CALCULÉ depuis le total du mois précédent, pas stocké.

- Saisie : une modale unique, avec une case "récurrente" (+ option fin)
  qui décide si l'opération devient une règle.

- Ajouter un affichage pour les prélevements a venir, (je suis en juin et
  un crédit commence en aout il me faut un texte a côté de chaque mois qui 
  indique le prélèvement de aout)

- Masquer la ligne de report si le mois courant est le mois racine.

- Formater de l'affichage du mois: "Septembre 2026" a la place du formart "YYYY-MM".

- Pour la modale d'ajout, dans le futur, afficher les erreurs a coté des des champs manquant.
  (le libellé en rouge sous son input, etc.), plutôt qu'un message global. C'est le plus ergonomique,
  mais ça demande un state d'erreur par champ. Note-le comme raffinement pour quand tu feras le CSS.

- Ajouter un composant, pour les livret (A, jeune, PEA, PEL, ...), avec montant brut, possibilitée de,
  re-prendre de l'argent dessus pour le mois en cours.
  Ajouter l'argent depuis les opérations ponctuelle du mois.

- V2 possible : matérialisation à la volée (option C) avec notion de mois clos,
  pour que les modifs de règles se reflètent sur les mois non clos.

- Blinder generateMonths : si lastMonth > currentMonth,
  ne rien faire (sortie anticipée).

- generateMonths écrase les opérations d'un mois qu'elle regénère → perte des opérations ponctuelles
  saisies à la main. À corriger : ne pas regénérer un mois qui existe déjà, 
  ou fusionner au lieu d'écraser.
