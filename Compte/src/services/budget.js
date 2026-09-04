import { getFirstMonth, getInitialBalance, getOperations, getRules, getLastMonth, setFirstMonth, setInitialBalance, setOperations, setLastMonth } from "./storage.js";
import { getPreviousMonth, getNextMonth } from"../utils/dates.js";

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

/***
 * vérifie dans la liste des règles de l'utilisateur et les ajoute si,
 * elle passe la condition pour le mois donné
 * @param {string} month - mois a metérialiser au format "YYYY-MM"
 * @param {Array}  rules - tableau des règles
 * @returns {Array} tableau des opérations du mois (chacune avec origin: "rules")
 */
 export function materializeRules(month, rules){
    const operations = [];
    for(const rule of rules){
        if (month >= rule.start && (rule.end === null || month <= rule.end) ){
            operations.push(
                {
                    label: rule.label,
                    value: rule.value,
                    type: rule.type,
                    origin: "rule"
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

export function generateMonths(){
    const rules = getRules();
    const lastMonth = getLastMonth();
    /*affiche la date actuelle au bon format "YYYY-MM", ajout du +1 pour le mois, janvier étant 0*/
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const currentMonth = `${year}-${String(month).padStart(2, '0')}`;
    /**/

    if(lastMonth === null){
        setFirstMonth(currentMonth);
        setInitialBalance(0);
        const operations = materializeRules(currentMonth, rules);
        setOperations(currentMonth, operations);
        setLastMonth(currentMonth);
        return;
    }

    let monthToGenerate = lastMonth;
    while(monthToGenerate !== currentMonth){
        monthToGenerate = getNextMonth(monthToGenerate);
        const operations = materializeRules(monthToGenerate, rules);
        setOperations(monthToGenerate, operations);

    }setLastMonth(currentMonth);
}