import { MONTHS } from "../constants/months";
/***
 * récupère le mois suivant, a partir de la date donnée, ajoute 1 au mois ou a l'année
 * @param {string}  dateString - mois de départ au format "YYYY-MM"
 * @returns {string} le mois suivant au même format "YYYY-MM"
 */
export function getNextMonth(dateString) {
  const { year, month } = parseMonthKey(dateString);

  let nextYear;
  let nextMonth;

  if (month === 12) {
    nextMonth = 1;
    nextYear = year + 1;
  } else {
    nextMonth = month + 1;
    nextYear = year;
  }

  return toMonthKey(nextYear, nextMonth);
}

/***
 * récupère le mois precedent, a partie de la date donnée, retire 1 au mois ou a l'année
 * @param {string}  dateString - mois de départ au format "YYYY-MM"
 * @returns {string} le mois precedent au même format "YYYY-MM"
 */
export function getPreviousMonth(dateString) {
  const { year, month } = parseMonthKey(dateString);

  let prevYear;
  let prevMonth;

  if (month === 1) {
    prevMonth = 12;
    prevYear = year - 1;
  } else {
    prevMonth = month - 1;
    prevYear = year;
  }

  return toMonthKey(prevYear, prevMonth);
}
/***
 * récupère le mois actuel
 * @returns {string} le mois actuelle au format "YYYY-MM"
 */
export function getCurrentMonth() {
  const now = new Date();

  return toMonthKey(now.getFullYear(), now.getMonth() + 1);
}

/**
 * Génère la liste des années proposées dans les sélecteurs de date,
 * de l'année en cours jusqu'à dix ans plus tard.
 * @returns {number[]} les années, par ordre croissant (ex : [2026, ..., 2036])
 */
export function getYearsOption() {
  const years = [];
  const startYear = new Date().getFullYear();

  for (let year = startYear; year <= startYear + 10; year++) {
    years.push(year);
  }
  return years;
}

/**
 * Transforme une clé de mois en libellé lisible pour l'affichage.
 * @param {string} dateString - la clé de mois au format "YYYY-MM"
 * @returns {string} le libellé (ex : "septembre 2026")
 */
export function formatMonth(dateString) {
  const { year, month } = parseMonthKey(dateString);
  const monthName = MONTHS[month - 1];
  return `${monthName} ${year}`;
}

/**
 * Assemble une année et un mois en clé de mois au format "YYYY-MM".
 * Ajoute le zéro devant les mois à un chiffre.
 * @param {number|string} year - l'année (ex : 2026)
 * @param {number|string} month - le mois, de 1 à 12
 * @returns {string} la clé de mois (ex : "2026-03")
 */
export function toMonthKey(year, month) {
  const paddedMonth = String(month).padStart(2, "0");
  return `${year}-${paddedMonth}`;
}

/**
 * Découpe une clé de mois "YYYY-MM" en année et mois numériques.
 * Opération inverse de toMonthKey.
 * @param {string} monthKey - la clé de mois (ex : "2026-03")
 * @returns {{ year: number, month: number }} l'année et le mois (ex : { year: 2026, month: 3 })
 */
export function parseMonthKey(monthKey) {
  const dateSplit = monthKey.split("-");
  const year = Number(dateSplit[0]);
  const month = Number(dateSplit[1]);

  return { year, month };
}
