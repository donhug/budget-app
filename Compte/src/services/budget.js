import {
  getFirstMonth,
  getInitialBalance,
  getOperations,
  getRules,
  getLastMonth,
  setFirstMonth,
  setInitialBalance,
  setOperations,
  setLastMonth,
} from "./storage.js";
import {
  getPreviousMonth,
  getNextMonth,
  getCurrentMonth,
} from "../utils/dates.js";
const MAX_MONTHS_TO_GENERATE = 120;
/***
 * Calcul le total des opérations pour un mois donné.
 * @param {Array}  listOperations - liste des opérations du mois
 * @returns {number} le total des opérations du mois
 */
export function getMonthTotal(listOperations) {
  let total = 0;
  for (const operation of listOperations) {
    total = total + operation.value;
  }
  return total;
}

/**
 * calcule le solde d'un mois donné, report inclus,
 * Fonction récursive :remonte de mois en mois jusqu'au mois racine
 * (firstMonth), en additionnant le total de chaque mois au solde initial.
 * ajout d'un arrêt, si le l'app vient d'être intialisée.
 * evite donc a la fonction d'aller avant le premier mois
 * @param {string} month - le mois a calculer, au format "YYYY-MM"
 * @returns {number} le solde du mois (+ ou -)
 */
export function getBalance(month) {
  const firstMonth = getFirstMonth();

  if (month < firstMonth) {
    return 0;
  }

  if (month === firstMonth) {
    return getInitialBalance() + getMonthTotal(getOperations(month));
  }

  return (
    getMonthTotal(getOperations(month)) + getBalance(getPreviousMonth(month))
  );
}

/***
 * vérifie dans la liste des règles de l'utilisateur et les ajoute si,
 * elle passe la condition pour le mois donné
 * @param {string} month - mois a metérialiser au format "YYYY-MM"
 * @param {Array}  rule - tableau des règles
 * @returns {Array} tableau des opérations du mois (chacune avec origin: "rules")
 */
export function materializeRules(month, rules) {
  const operations = [];
  for (const rule of rules) {
    if (month >= rule.start && (rule.end === null || month <= rule.end)) {
      operations.push({
        id: crypto.randomUUID(),
        ruleId: rule.id,
        label: rule.label,
        value: rule.value,
        type: rule.type,
        origin: "rule",
      });
    }
  }
  return operations;
}

/**
 * génère les mois manquants (format "YYYY-MM"), qui n'ont pas été créés, depuis le dernier
 * mois généré. Pour chaque mois créé, elle matérialise les règles et stocke les opérations.
 * Mise à jour du premier mois (si premier lancement) et dernier mois généré avec le setLastMonth
 * @returns {void}
 */

export function generateMonths() {
  const rules = getRules();
  const lastMonth = getLastMonth();
  const currentMonth = getCurrentMonth();

  if (lastMonth === null) {
    setFirstMonth(currentMonth);
    setInitialBalance(0);
    const operations = materializeRules(currentMonth, rules);
    setOperations(currentMonth, operations);
    setLastMonth(currentMonth);
    return;
  }

  if (lastMonth >= currentMonth) {
    return;
  }

  let monthToGenerate = lastMonth;
  let monthGenerated = 0;

  while (
    monthToGenerate !== currentMonth &&
    monthGenerated < MAX_MONTHS_TO_GENERATE
  ) {
    //I.progression
    monthGenerated++;
    monthToGenerate = getNextMonth(monthToGenerate);
    //II. verification: si le mois a déjà des données, on passe au suivant
    const existing = getOperations(monthToGenerate);
    if (existing.length > 0) continue;
    //III.caluler, puis enregistrer
    const operations = materializeRules(monthToGenerate, rules);
    setOperations(monthToGenerate, operations);
  }
  if (monthGenerated === MAX_MONTHS_TO_GENERATE) {
    console.warn("limite de 120 mois atteinte");
  }
  setLastMonth(currentMonth);
}

/***
 * Regroupe les règles par mois de début.
 * @param {Array}  rules - tableau des règles
 * @returns {object<string, Array} Un objet dont chaque clé est un mois "YYYY-MM"
 *    et chaque valeur la liste des règles qui commencent ce mois-là
 *    ( ex : {"2026-11":[règleA règleC], "2026-12":[règleB] })
 */
export function groupRulesByStartMonth(rules) {
  const rulesByMonth = {};

  for (const rule of rules) {
    if (!rulesByMonth[rule.start]) {
      rulesByMonth[rule.start] = [];
    }
    rulesByMonth[rule.start].push(rule);
  }
  return rulesByMonth;
}
