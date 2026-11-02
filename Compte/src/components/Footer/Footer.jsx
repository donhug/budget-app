import style from "./Footer.module.css";
import { FaGithub, FaCircleInfo } from "react-icons/fa6";
import { buildObjectExport, validateObjectImport } from "../../services/backup";
import { downloadObject } from "../../utils/downloadObject";
import { replaceAllData } from "../../services/storage";
function Footer() {
  function handleExport() {
    const objectForExport = buildObjectExport();
    const date = new Date().toISOString().slice(0, 10);
    const nameFileExport = `hf-budget-${date}.json`;
    downloadObject(objectForExport, nameFileExport);
  }
  async function handleImport(event) {
    const file = event.target.files[0];
    event.target.value = "";
    if (!file) {
      return;
    }
    const fileText = await file.text();

    let data;
    try {
      data = JSON.parse(fileText);
    } catch {
      alert("Le format du fichier n'est pas le bon.");
      return;
    }
    const fileToValidate = validateObjectImport(data);
    if (fileToValidate) {
      alert(fileToValidate);
      return;
    }

    const downloadOldData = window.confirm(
      "Voulez-vous télécharger vos données actuelles avant ? ",
    );
    if (downloadOldData) {
      handleExport();
    }
    const fileDate = new Date(data.meta.exportedAt);
    const date = fileDate.toLocaleDateString("fr-FR");
    const erase = window.confirm(
      `Toutes vos données actuelles seront remplacées par la sauvegarde du ${date}. Continuer ?`,
    );
    if (!erase) {
      return;
    }

    replaceAllData(data);
    window.location.reload();
  }
  return (
    <footer className={style.footer}>
      <p className={style.text}>HF — Hugo Finances · v1.0 · © 2026</p>
      <p className={style.warning}>
        <FaCircleInfo />
        Vos données sont enregistrées uniquement dans ce navigateur. Effacer les
        données de navigation / des sites ou changer d'appareil les supprimera.
      </p>

      <button type="button" onClick={handleExport}>
        Télécharger vos données
      </button>
      <input
        type="file"
        accept=".json"
        aria-label="ajouter un fichier de sauvegarde"
        onChange={handleImport}
      />
      <a
        href="https://github.com/donhug"
        target="_blank"
        rel="noopener noreferrer"
        className={style.link}
        aria-label="GitHub d'Hugo"
      >
        <FaGithub />
      </a>
    </footer>
  );
}

export default Footer;
