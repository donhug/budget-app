import { SAVINGS_CATALOG } from "../constants/accounts";
import { getAllOperationsByMonth } from "./budget";

/**
 * Retrouve l'entrée du catalogue correspondant à un identifiant.
 *
 * @param {string|null} catalogId - l'identifiant d'une entrée du catalogue (ex. "livretA"), `null` pour un compte « Autre »
 * @returns {object|undefined} - l'entrée du catalogue, ou `undefined` si aucune ne correspond
 */
export function getCatalogEntry(catalogId) {
  return SAVINGS_CATALOG.find((entry) => entry.id === catalogId);
}

/**
 * Donne le taux d'un compte d'épargne.
 * Le taux stocké dans le compte (saisi par l'utilisateur) est prioritaire ;
 * sinon, on lit celui du catalogue, pour suivre les changements de taux officiels.
 *
 * @param {object} account - le compte d'épargne
 * @returns {number|null} - le taux annuel en % (1.7 = 1,7 %), ou `null` s'il n'y en a pas
 */
export function getAccountRate(account) {
  const accountEntry = getCatalogEntry(account.catalogId);
  const rate = account.rate ?? accountEntry?.rate ?? null;

  return rate;
}

/**
 * Donne le plafond d'un compte d'épargne.
 * Le plafond stocké dans le compte (saisi par l'utilisateur) est prioritaire ;
 * sinon, on lit celui du catalogue.
 *
 * @param {object} account - le compte d'épargne
 * @returns {number|null} - le plafond en euros, ou `null` s'il n'y en a pas
 */
export function getAccountCeiling(account) {
  const accountEntry = getCatalogEntry(account.catalogId);
  const ceiling = account.ceiling ?? accountEntry?.ceiling ?? null;

  return ceiling;
}

/**
 * Calcule le solde d'un compte d'épargne : jamais stocké, toujours recalculé.
 * Solde = solde initial − somme des opérations du compte (tous les mois confondus).
 * Convention de signe (vue du compte courant) : un versement vaut −50 dans le budget,
 * donc +50 sur le compte ; un retrait vaut +30 dans le budget, donc −30 sur le compte.
 * Les opérations sans `accountId` (dépenses, revenus) sont ignorées.
 *
 * @param {object} account - le compte d'épargne
 * @returns {number} - le solde du compte, en euros
 */
export function getAccountBalance(account) {
  const allOperationByMonth = getAllOperationsByMonth();
  const listOperation = Object.values(allOperationByMonth);
  const allOperations = listOperation.flat();
  const accountOperations = allOperations.filter(
    (operation) => operation.accountId === account.id,
  );
  const sumOperation = accountOperations.reduce(
    (total, operation) => total + operation.value,
    0,
  );
  const accountBalance = account.initialBalance - sumOperation;
  return accountBalance;
}
