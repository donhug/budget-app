import { getFirstMonth, getInitialBalance, getOperations } from "./storage.js";
import { getPreviousMonth } from"../utils/dates.js";

/***
 * Calcul le total des opérations pour un mois donné.
 * @param {Array}  listOperations - liste des opérations du mois
 * @returns {number} le total des opérations du mois
 */
export function getMonthTotal(listOperations) {
    let total = 0;
    for(const operation of listOperations){
        total = total + operation.value;
    }
    return total;
}

/**
 * calcule le solde d'un mois donné, report inclus,
 * Fonction récursive. :remonte de mois en mois jusqu'au mois racine
 * (firstMont), en additionnant le total de chaque mois au solde initial.
 * @param {string} month - le mois a calculer, au foramt "YYYY-MM"
 * @returns {number} le solde du mois (+ ou -)
 */
export function getBalance(month){
    const firstMonth = getFirstMonth();

    if( month === firstMonth){
        return getInitialBalance() + getMonthTotal(getOperations(month));
    }

    return getMonthTotal(getOperations(month)) + getBalance(getPreviousMonth(month))

}