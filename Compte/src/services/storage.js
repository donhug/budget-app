/**
 * Enregistre la liste des règles, dans le localStorage, sous forme de chaîne JSON.
 * @param {Array} rulesParm - le tableau des règles à stocker
 */

export function setRules(rulesParm) {
    const rulesString = JSON.stringify(rulesParm);
    localStorage.setItem("rules", rulesString);
}

/**
 * Récupère la liste des règles depuis le localStorage.
 * @returns {Array} - le tableau des règles, ou un tableau vide si rien n'est stocké
 */

export function getRules(){
    const rulesString = localStorage.getItem("rules");

    if (rulesString === null){
        return []
    }else{
        return JSON.parse(rulesString);
    }
}

/**
 * Définit le solde initial du compte
 * @param {number} balance - solde initial du compte
 */

export function setInitialBalance(balance){
    const balanceString = JSON.stringify(balance);
    localStorage.setItem("initialBalance", balanceString);
}

/***
 * Récupère le solde initial du compte, depuis le localStorage.
 * @returns {number} solde initial du compte
 */

export function getInitialBalance() {
    const balanceString = localStorage.getItem("initialBalance");

    if (balanceString === null){
        return 0.00
    }else{
        return JSON.parse(balanceString);
    }
}

/***
 * Enregistre les opérations du mois, dans le localStorage, sous forme de chaîne JSON.
 * @param {string} month - identifiant du mois au format "YYYY-MM" pour la liste des opérations
 * @param {Array} operations - liste les opération du mois
 */

export function setOperations(month, operations) {
    const key = `operations-${month}`;
    const operationsString = JSON.stringify(operations);
    localStorage.setItem(key, operationsString);
}

/***
 * Récupère les opérations du mois, depuis le localStorage.
 * @param {string} month - identifiant du mois au format "YYYY-MM" pour récupérer la liste
 * @returns{Array} - le tableau des opérations, ou un tableau vide si rien n'est stocké
 */

export function getOperations(month) {
    const key = `operations-${month}`;
    const operationsString = localStorage.getItem(key);

    if (operationsString === null){
        return []
    }else{
        return JSON.parse(operationsString);
    }
}

/**
 * Définit le mois initial de l'App
 * @param {string} month - mois initial du compte, au format "2026-04"
 */

export function setFirstMonth(month){
    const firstMonth = JSON.stringify(month);
    localStorage.setItem("firstMonth",firstMonth)
}

/**
 *  Récupère le mois initial de l'App
 * @returns {string|null} mois initial du compte, au format "2026-04", ou null si non défini
 */

export function getFirstMonth(){
    const firstMonth = localStorage.getItem("firstMonth")

    if(firstMonth === null){
        return null
    }else{
        return JSON.parse(firstMonth);
    }
}