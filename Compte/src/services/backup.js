import { getFirstMonth, getLastMonth, getOperations } from "./storage.js";
import { getNextMonth } from "../utils/dates";
const MAX_MONTHS = 120;

/***
 * Regroupe les opérations mois par mois et les rassemble dans un objet,
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
