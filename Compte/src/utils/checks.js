/**
 * Verifie, que la valeur soit bien un objet non null, et non pas un tableau
 *
 * @param {*} value - donnée a tester
 * @returns {boolean} true ou false
 */
export function isPlainObject(value) {
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    return true;
  }
  return false;
}
