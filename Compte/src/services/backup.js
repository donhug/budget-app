import {
  getFirstMonth,
  getInitialBalance,
  getLastMonth,
  getOperations,
  getRules,
} from "./storage.js";
import { getNextMonth, isMonthKey } from "../utils/dates";
import { isPlainObject } from "../utils/checks.js";
import { META_APP, META_SCHEMA_VERSION } from "../constants/meta.js";
import {
  ERROR_DAMAGED,
  ERROR_WRONG_APP,
  ERROR_VERSION,
} from "../constants/errorMessage.js";
const MAX_MONTHS = 120;

/**
 * Regroupe les opérations mois par mois et les rassemble dans un objet,
 *
 * @returns {object<string, Array>} Un objet dont chaque clé est un mois "YYYY-MM"
 *    et chaque valeur la liste des opérations du mois
 *    ( ex : {"2026-11":[opA opB], "2026-12":[opA opB] }).
 *    Ou un Objet Vide si il n'y a rien dans le localStorage.
 */
export function getObjectMonths() {
  const firstMonth = getFirstMonth();
  const lastMonth = getLastMonth();
  const monthObject = {};
  let monthsRead = 0;

  if (firstMonth === null) {
    return monthObject;
  }

  let traveledMonth = firstMonth;

  while (traveledMonth <= lastMonth && monthsRead < MAX_MONTHS) {
    monthsRead++;
    monthObject[traveledMonth] = getOperations(traveledMonth);
    traveledMonth = getNextMonth(traveledMonth);
  }

  if (monthsRead === MAX_MONTHS) {
    console.warn("limite de 120 mois atteinte");
  }
  return monthObject;
}

/**
 * Renvoie l'objet, qui regroupe toutes les informations de l'App, avec la date de
 * l'export, le nom de l'App, la version du format des données.
 * Cet objet sera converti en JSON, pour créer une sauvegarde des données utilisateur
 *
 * @returns {object} contient toutes les informations utilisateur.
 *
 * @example
 * {
 *   "meta": {
 *     "app": "HF-Budget",
 *     "schemaVersion": 1,
 *     "exportedAt": "2026-10-19T22:58:00.000Z"
 *   },
 *   "rules": [ { id, label, value, type, start, end }, ... ],
 *   "initialBalance": 0,
 *   "firstMonth": "2026-09",
 *   "lastMonth": "2026-10",
 *   "months": {
 *     "2026-09": [ { id, ruleId, label, value, type, origin }, ... ],
 *     "2026-10": [ ... ]
 *   }
 * }
 */
export function buildObjectExport() {
  const exportedAt = new Date().toISOString();
  const monthOperations = getObjectMonths();
  const firstMonth = getFirstMonth();
  const lastMonth = getLastMonth();
  const rules = getRules();
  const initialBalance = getInitialBalance();

  const objectExport = {
    meta: {
      app: META_APP,
      schemaVersion: META_SCHEMA_VERSION,
      exportedAt,
    },
    rules,
    initialBalance,
    firstMonth,
    lastMonth,
    months: monthOperations,
  };
  return objectExport;
}
export function validateObjectImport(data) {
  if (!isPlainObject(data)) {
    return ERROR_WRONG_APP;
  }
  if (!isPlainObject(data.meta)) {
    return ERROR_WRONG_APP;
  }
  if (data.meta.app !== META_APP) {
    return ERROR_WRONG_APP;
  }
  if (data.meta.schemaVersion !== META_SCHEMA_VERSION) {
    return ERROR_VERSION;
  }

  if (!Array.isArray(data.rules)) {
    return ERROR_DAMAGED;
  }
  if (!isPlainObject(data.months)) {
    return ERROR_DAMAGED;
  }
  if (typeof data.initialBalance !== "number") {
    return ERROR_DAMAGED;
  }
  if (!isMonthKey(data.firstMonth) || !isMonthKey(data.lastMonth)) {
    return ERROR_DAMAGED;
  }
  if (data.firstMonth > data.lastMonth) {
    return ERROR_DAMAGED;
  }

  for (const [monthKey, listOperation] of Object.entries(data.months)) {
    if (!isMonthKey(monthKey)) {
      return ERROR_DAMAGED;
    }
    if (!Array.isArray(listOperation)) {
      return ERROR_DAMAGED;
    }
    for (const operation of listOperation) {
      if (!isPlainObject(operation) || typeof operation.value !== "number") {
        return ERROR_DAMAGED;
      }
    }
  }

  return null;
}
