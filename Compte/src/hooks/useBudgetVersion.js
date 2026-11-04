import { useEffect, useState } from "react";
import { BUDGET_UPDATED_EVENT } from "../constants/events";

/**
 * Fournit un compteur qui augmente à chaque modification des données budgétaires
 * (événement BUDGET_UPDATED_EVENT). Sa valeur n'a pas de sens en soi : il sert de
 * dépendance à un useMemo pour relancer un calcul quand les données changent.
 *
 * @returns {number} la "version" actuelle des données
 */
export function useBudgetVersion() {
  const [version, setVersion] = useState(0);

  useEffect(() => {
    function handleUpdate() {
      setVersion((v) => v + 1);
    }
    window.addEventListener(BUDGET_UPDATED_EVENT, handleUpdate);
    return () => {
      window.removeEventListener(BUDGET_UPDATED_EVENT, handleUpdate);
    };
  }, []);

  return version;
}
