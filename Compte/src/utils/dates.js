import { MONTHS } from "../constants/months";
import { MONTHS_STATE } from "../constants/stateMonths";
/**
 * récupère le mois suivant, a partir de la date donnée, ajoute 1 au mois ou a l'année
 *
 * @param {string} dateString - mois de départ au format "YYYY-MM"
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

/**
 * récupère le mois precedent, a partie de la date donnée, retire 1 au mois ou a l'année
 *
 * @param {string} dateString - mois de départ au format "YYYY-MM"
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
/**
 * récupère le mois actuel
 *
 * @returns {string} le mois actuelle au format "YYYY-MM"
 */
export function getCurrentMonth() {
  const now = new Date();

  return toMonthKey(now.getFullYear(), now.getMonth() + 1);
}

/**
 * Génère la liste des années proposées dans les sélecteurs de date,
 * de l’année de départ reçue jusqu’à dix ans après l’année en cours.
 * @param {number} startYear - année de départ de la liste.
 * @returns {number[]} les années, par ordre croissant (ex : [2026, ..., 2036])
 */
export function getYearsOption(startYear) {
  const years = [];
  const currentYear = new Date().getFullYear();

  for (let year = startYear; year <= currentYear + 10; year++) {
    years.push(year);
  }
  return years;
}

/**
 * Transforme une clé de mois en libellé lisible pour l'affichage.
 *
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
 *
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
 *
 * @param {string} monthKey - la clé de mois (ex : "2026-03")
 * @returns {{ year: number, month: number }} l'année et le mois (ex : { year: 2026, month: 3 })
 */
export function parseMonthKey(monthKey) {
  const dateSplit = monthKey.split("-");
  const year = Number(dateSplit[0]);
  const month = Number(dateSplit[1]);

  return { year, month };
}
/**
 * verifie que la date soit bien une chaine, et, au bon format "YYYY-MM".
 * précise un mois de 01 à 12
 *
 * @param {*} value - donnée a tester
 * @returns {boolean} true ou false
 */
export function isMonthKey(value) {
  const monthKeyPattern = /^\d{4}-(0[1-9]|1[0-2])$/;
  if (typeof value === "string" && monthKeyPattern.test(value)) {
    return true;
  }
  return false;
}
/**
 * Vérifie qu'une valeur est une année au format "YYYY" : une chaîne de quatre chiffres
 * (par exemple le paramètre :year de l'URL).
 *
 * @param {*} value - donnée à tester
 * @returns {boolean} true si c'est une chaîne de quatre chiffres, sinon false
 */
export function isYearKey(value) {
  const yearKeyPattern = /^\d{4}$/;
  if (typeof value === "string" && yearKeyPattern.test(value)) {
    return true;
  }
  return false;
}
/**
 * Retourne une nouvelle date, au même jour, à minuit (00:00:00, heure locale).
 *
 * @param {Date|string} date - la date à convertir (objet Date ou chaîne ISO)
 * @returns {Date} la date du même jour, remise à minuit
 */
export function startOfDay(date) {
  const madeDate = new Date(date);
  const year = madeDate.getFullYear();
  const month = madeDate.getMonth();
  const day = madeDate.getDate();
  const midnight = new Date(year, month, day);
  return midnight;
}

const MS_PER_DAY = 1000 * 60 * 60 * 24;
/**
 * Calcule le nombre de jours du calendrier écoulés depuis une date.
 *
 * @param {string|null} isoDate - la date de départ au format ISO, ou null
 * @param {Date} [now=new Date()] - l'instant de référence
 * @returns {number|null} le nombre de jours (arrondi au plus proche), ou null si aucune date
 */
export function getDaysSince(isoDate, now = new Date()) {
  if (isoDate === null) {
    return null;
  }
  const today = startOfDay(now);
  const saveDay = startOfDay(isoDate);

  return Math.round((today - saveDay) / MS_PER_DAY);
}

/**
 * Transforme un nombre de jours depuis la dernière sauvegarde en libellé lisible.
 *
 * @param {number|null} days - nombre de jours écoulés, ou null si jamais sauvegardé
 * @returns {string} le libellé (ex : "jamais", "aujourd'hui", "hier", "il y a 3 jours")
 */
export function getSaveLabel(days) {
  if (days === null) {
    return "jamais";
  }
  if (days === 0) {
    return "aujourd'hui";
  }
  if (days === 1) {
    return "hier";
  }
  return `il y a ${days} jours`;
}

/**
 * Retourne l'état d'un mois par rapport au premier mois de l'app et au mois en cours.
 *
 * @param {string} monthKey - clé du mois à classer, au format "YYYY-MM"
 * @param {string|null} firstMonth - clé du premier mois de l'app, ou null
 * @param {string} currentMonth - clé du mois en cours
 * @returns {string} une valeur de MONTHS_STATE :
 *  "before" (avant le premier mois, ou aucun premier mois),
 *  "past" (entre le premier mois et le mois en cours),
 *  "current" (le mois en cours),
 *  "future" (après le mois en cours)
 */
export function getMonthState(monthKey, firstMonth, currentMonth) {
  if (firstMonth === null) {
    return MONTHS_STATE.before;
  }
  if (monthKey < firstMonth) {
    return MONTHS_STATE.before;
  }
  if (monthKey === currentMonth) {
    return MONTHS_STATE.current;
  }
  if (monthKey < currentMonth) {
    return MONTHS_STATE.past;
  }
  return MONTHS_STATE.future;
}
/**
 * Renvoie la liste des années entre deux bornes, incluses.
 *
 * @param {number} startYear - première année de la liste
 * @param {number} endYear - dernière année de la liste
 * @returns {number[]} les années, par ordre croissant (ex : [2025, 2026])
 */
export function getListYears(startYear, endYear) {
  const years = [];

  for (let year = startYear; year <= endYear; year++) {
    years.push(year);
  }
  return years;
}
