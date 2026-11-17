import { SAVINGS_CATALOG } from "../constants/accounts";

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
 * @returns {number|null|undefined} - le taux annuel en % (1.7 = 1,7 %), ou `null` / `undefined` s'il n'y en a pas
 */
export function getAccountRate(account) {
  const accountEntry = getCatalogEntry(account.catalogId);
  const rate = account.rate ?? accountEntry?.rate;

  return rate;
}

/**
 * Donne le plafond d'un compte d'épargne.
 * Le plafond stocké dans le compte (saisi par l'utilisateur) est prioritaire ;
 * sinon, on lit celui du catalogue.
 *
 * @param {object} account - le compte d'épargne
 * @returns {number|null|undefined} - le plafond en euros, ou `null` / `undefined` s'il n'y en a pas
 */
export function getAccountCeiling(account) {
  const accountEntry = getCatalogEntry(account.catalogId);
  const ceiling = account.ceiling ?? accountEntry?.ceiling;

  return ceiling;
}
