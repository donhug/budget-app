/**
 * Télécharge le fichier JSON, avec les informations de l'app au format JSON.
 * @param {object} data - objet qui contient toutes les données de l'app.
 * @param {string} fileName - nom pour le fichier téléchargé
 *
 * @returns {void}
 */
export function downloadObject(data, fileName) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}
