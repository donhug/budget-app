import {
  getFirstMonth,
  getInitialBalance,
  getLastMonth,
  getRules,
} from "./storage.js";
import { isMonthKey } from "../utils/dates";
import { isPlainObject } from "../utils/checks.js";
import { META_APP, META_SCHEMA_VERSION } from "../constants/meta.js";
import {
  ERROR_DAMAGED,
  ERROR_WRONG_APP,
  ERROR_VERSION,
} from "../constants/errorMessage.js";
import { getAllOperationsByMonth } from "./budget.js";
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
  const monthOperations = getAllOperationsByMonth();
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
/**
 * Vérifie qu'un objet importé est une sauvegarde valide de l'application,
 * avant de remplacer les données du localStorage.
 * Contrôle, dans l'ordre : l'origine (meta.app), la version du format
 * (meta.schemaVersion), puis la structure des données (règles, solde initial,
 * premier et dernier mois, et opérations de chaque mois).
 *
 * @param {*} data - l'objet obtenu après JSON.parse du fichier importé
 * @returns {string|null} le message d'erreur à afficher
 *    (ERROR_WRONG_APP, ERROR_VERSION ou ERROR_DAMAGED),
 *    ou null si la sauvegarde est valide
 */
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
