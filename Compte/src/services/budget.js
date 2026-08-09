/***
 * Calcul le total des opérations pour un mois donné.
 * @param {Array}  listOperations - liste des opération du mois
 * @returns {number} le total des opérations du mois
 */

export function getMonthTotal(listOperations) {
    let total = 0;
    for(const operation of listOperations){
        total = total + operation.value;
    }
    return total;
}