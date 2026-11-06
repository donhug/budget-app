import { useEffect, useState } from "react";

/**
 * Fournit l'instant présent, mis à jour à intervalle régulier.
 * L'intervalle est nettoyé quand le composant qui utilise le hook disparaît.
 *
 * @param {number} [interval=1000] - délai entre deux mises à jour, en millisecondes
 * @returns {Date} l'instant présent
 */
export function useClock(interval = 1000) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => {
      setNow(new Date());
    }, interval);
    return () => {
      clearInterval(id);
    };
  }, [interval]);

  return now;
}
