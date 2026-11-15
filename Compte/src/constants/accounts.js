/**
 * Catalogue des produits d'épargne proposés à la création d'un compte.
 * Valeurs vérifiées le 13/11/2026 (taux en vigueur jusqu'au 31/01/2027,
 * prochaine révision le 01/02/2027).
 *
 * Source de vérité pour le plafond et le taux : un compte créé depuis le
 * catalogue ne les stocke pas, il garde seulement son `catalogId` et relit
 * ces valeurs ici. Un taux ou un plafond saisi par l'utilisateur dans le
 * compte reste prioritaire (cas du Livret Jeune).
 * Un compte « Autre » n'a pas d'entrée ici (`catalogId: null`).
 *
 * @type {Array<{
 *   id: string,
 *   label: string,
 *   kind: "livret" | "placement",
 *   ceiling: number | null,
 *   rate: number | null,
 * }>}
 * - `id` : identifiant stable, stocké dans le compte (`catalogId`). Ne jamais le modifier.
 * - `label` : nom affiché.
 * - `kind` : "livret" (solde, intérêts estimés) ou "placement" (montant versé, sans intérêts).
 * - `ceiling` : plafond en euros, `null` s'il n'y en a pas.
 * - `rate` : taux annuel en % (1.7 = 1,7 %), `null` pour un placement.
 *   Livret Jeune : taux minimum, modifiable par l'utilisateur.
 */
export const SAVINGS_CATALOG = [
  {
    id: "livretA",
    label: "Livret A",
    kind: "livret",
    ceiling: 22950,
    rate: 1.7,
  },
  {
    id: "ldds",
    label: "LDDS",
    kind: "livret",
    ceiling: 12000,
    rate: 1.7,
  },
  {
    id: "lep",
    label: "LEP",
    kind: "livret",
    ceiling: 10000,
    rate: 2.5,
  },
  {
    id: "livretJeune",
    label: "Livret Jeune",
    kind: "livret",
    ceiling: 1600,
    rate: 1.7,
  },
  {
    id: "cel",
    label: "CEL",
    kind: "livret",
    ceiling: 15300,
    rate: 1.25,
  },
  {
    id: "pea",
    label: "PEA",
    kind: "placement",
    ceiling: 150000,
    rate: null,
  },
  {
    id: "cto",
    label: "CTO",
    kind: "placement",
    ceiling: null,
    rate: null,
  },
  {
    id: "assuranceVie",
    label: "Assurance-vie",
    kind: "placement",
    ceiling: null,
    rate: null,
  },
];
