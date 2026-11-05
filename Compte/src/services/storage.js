import { BUDGET_UPDATED_EVENT } from "../constants/events.js";
/**
 * Enregistre la liste des règles, dans le localStorage, sous forme de chaîne JSON.
 *
 * @param {Array} rulesParm - le tableau des règles à stocker
 */
export function setRules(rulesParm) {
  const rulesString = JSON.stringify(rulesParm);
  localStorage.setItem("rules", rulesString);
  notifyBudgetUpdated();
}

/**
 * Récupère la liste des règles depuis le localStorage.
 *
 * @returns {Array} - le tableau des règles, ou un tableau vide si rien n'est stocké
 */
export function getRules() {
  const rulesString = localStorage.getItem("rules");

  if (rulesString === null) {
    return [];
  } else {
    return JSON.parse(rulesString);
  }
}

/**
 * supprime une règle sélectionnée de la liste.
 *
 * @param {string} ruleId - identification unique de la règle a supprimer.
 */
export function deleteRule(ruleId) {
  const rules = getRules();
  const updated = rules.filter((rule) => rule.id !== ruleId);
  setRules(updated);
}

/**
 * Définit le solde initial du compte
 *
 * @param {number} balance - solde initial du compte
 */
export function setInitialBalance(balance) {
  const balanceString = JSON.stringify(balance);
  localStorage.setItem("initialBalance", balanceString);
  notifyBudgetUpdated();
}

/**
 * Récupère le solde initial du compte, depuis le localStorage.
 *
 * @returns {number} solde initial du compte
 */
export function getInitialBalance() {
  const balanceString = localStorage.getItem("initialBalance");

  if (balanceString === null) {
    return 0.0;
  } else {
    return JSON.parse(balanceString);
  }
}

/**
 * Enregistre les opérations du mois, dans le localStorage, sous forme de chaîne JSON.
 *
 * @param {string} month - identifiant du mois au format "YYYY-MM" pour la liste des opérations
 * @param {Array} operations - liste les opération du mois
 */
export function setOperations(month, operations) {
  const key = `operations-${month}`;
  const operationsString = JSON.stringify(operations);
  localStorage.setItem(key, operationsString);
  notifyBudgetUpdated();
}

/**
 * Récupère les opérations du mois, depuis le localStorage.
 *
 * @param {string} month - identifiant du mois au format "YYYY-MM" pour récupérer la liste
 * @returns {Array} - le tableau des opérations, ou un tableau vide si rien n'est stocké
 */
export function getOperations(month) {
  const key = `operations-${month}`;
  const operationsString = localStorage.getItem(key);

  if (operationsString === null) {
    return [];
  } else {
    return JSON.parse(operationsString);
  }
}

/**
 * Supprime l'opération du mois séléctionée, depuis le localStorage.
 *
 * @param {string} month - identifiant du mois au format "YYYY-MM" pour récupérer la liste
 * @param {string} operationId - identification unique de l'operation a supprimer
 */
export function deleteOperation(month, operationId) {
  const operations = getOperations(month);
  const updated = operations.filter(
    (operation) => operation.id !== operationId,
  );
  setOperations(month, updated);
}

/**
 * Définit le mois initial de l'App
 *
 * @param {string} month - mois initial du compte, au format "2026-04"
 */
export function setFirstMonth(month) {
  const firstMonth = JSON.stringify(month);
  localStorage.setItem("firstMonth", firstMonth);
  notifyBudgetUpdated();
}

/**
 * Récupère le mois initial de l'App
 *
 * @returns {string|null} mois initial du compte, au format "2026-04", ou null si non défini
 */
export function getFirstMonth() {
  const firstMonth = localStorage.getItem("firstMonth");

  if (firstMonth === null) {
    return null;
  } else {
    return JSON.parse(firstMonth);
  }
}

/**
 * Définit le dernier mois généré de l'App
 *
 * @param {string} month - dernier mois du compte, au format "2026-04"
 */

export function setLastMonth(month) {
  const lastMonth = JSON.stringify(month);
  localStorage.setItem("lastMonth", lastMonth);
  notifyBudgetUpdated();
}

/**
 * Récupère le dernier mois de l'App
 *
 * @returns {string|null} dernier mois du compte, au format "2026-04", ou null si aucun
 */

export function getLastMonth() {
  const lastMonth = localStorage.getItem("lastMonth");

  if (lastMonth === null) {
    return null;
  } else {
    return JSON.parse(lastMonth);
  }
}
/**
 * Remplace toutes les données budgétaires par celles d'une sauvegarde :
 * supprime toutes les clés "operations-*", puis écrit les règles, le solde initial,
 * le premier et le dernier mois, et les opérations de chaque mois.
 * Ne vérifie rien : data doit avoir été validé au préalable avec validateObjectImport.
 *
 * @param {Object} data - l'objet de sauvegarde (meta, rules, initialBalance, firstMonth, lastMonth, months)
 * @returns {void}
 */
export function replaceAllData(data) {
  const keysName = [];
  for (const key of Object.keys(localStorage)) {
    if (key.startsWith("operations-")) {
      keysName.push(key);
    }
  }
  for (const keyToDelete of keysName) {
    localStorage.removeItem(keyToDelete);
  }
  setFirstMonth(data.firstMonth);
  setInitialBalance(data.initialBalance);
  setRules(data.rules);
  setLastMonth(data.lastMonth);

  for (const [monthKey, listOperation] of Object.entries(data.months)) {
    setOperations(monthKey, listOperation);
  }
}

/**
 * Enregistre la date de la dernière sauvegarde (export ou import) dans le localStorage,
 * sous la clé "lastSave".
 *
 * @param {string} date - la date de la sauvegarde, au format ISO (ex : "2026-11-05T20:23:00.000Z")
 * @returns {void}
 */
export function setLastBackup(date) {
  const lastSave = JSON.stringify(date);
  localStorage.setItem("lastSave", lastSave);
}

/**
 * Récupère la date de la dernière sauvegarde depuis le localStorage (clé "lastSave").
 *
 * @returns {string|null} la date au format ISO, ou null si aucune sauvegarde n'a été faite
 */
export function getLastBackup() {
  const lastSave = localStorage.getItem("lastSave");

  if (lastSave === null) {
    return null;
  } else {
    return JSON.parse(lastSave);
  }
}

/**
 * Prévient l'application que les données budgétaires ont changé,
 * en diffusant l'événement BUDGET_UPDATED_EVENT sur window.
 */
export function notifyBudgetUpdated() {
  const update = new Event(BUDGET_UPDATED_EVENT);
  window.dispatchEvent(update);
}
