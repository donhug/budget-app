import style from "./Footer.module.css";
import { FaGithub, FaCircleInfo, FaDownload, FaUpload } from "react-icons/fa6";
import {
  buildObjectExport,
  validateObjectImport,
  getObjectMonths,
} from "../../services/backup";
import { downloadObject } from "../../utils/downloadObject";
import {
  replaceAllData,
  setLastBackup,
  getLastBackup,
} from "../../services/storage";
import { getDaysSince, getSaveLabel } from "../../utils/dates";
import { useClock } from "../../hooks/useClock";
import { useMemo, useState } from "react";

function Footer() {
  const currentDate = useClock();
  const monthCount = useMemo(() => Object.keys(getObjectMonths()).length, []);
  const [lastSave, setLastSave] = useState(() => getLastBackup());

  function handleExport() {
    const objectForExport = buildObjectExport();
    const date = new Date().toISOString().slice(0, 10);
    const nameFileExport = `hf-budget-${date}.json`;
    downloadObject(objectForExport, nameFileExport);
    setLastBackup(objectForExport.meta.exportedAt);
    setLastSave(objectForExport.meta.exportedAt);
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
    const validationError = validateObjectImport(data);
    if (validationError) {
      alert(validationError);
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
    setLastBackup(data.meta.exportedAt);
    window.location.reload();
  }
  const daysSinceSave = getDaysSince(lastSave, currentDate);
  return (
    <footer className={style.footer} id="footer">
      <div className={style.grid}>
        <section className={style.block}>
          <h2 className={style.blockTitle}>Infos</h2>
          <div className={style.clock}>
            <span className={style.time}>
              {currentDate.toLocaleTimeString("fr-FR")}
            </span>
            <span className={style.date}>
              {currentDate.toLocaleDateString("fr-FR", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </span>
          </div>
          <p className={style.item}>
            {monthCount === 0
              ? "l'aventure commence"
              : `Mois au compteur : ${monthCount}`}
          </p>
          <p className={style.item}>
            Dernière sauvegarde : {getSaveLabel(daysSinceSave)}
          </p>
        </section>
        <section className={style.block}>
          <h2 className={style.blockTitle}> Le coin de l'écureuil</h2>
          <p className={style.item}>- humeur -</p>
          <p className={style.item}>- record -</p>
          <p className={style.proverb}>- proverbe -</p>
        </section>
        <section className={style.block}>
          <h2 className={style.blockTitle}>Sauvegarde</h2>
          <div className={style.actions}>
            <button
              type="button"
              className={style.actionBtn}
              onClick={handleExport}
            >
              <FaDownload /> Exporter
            </button>
            <label className={style.actionBtn}>
              <FaUpload /> Importer
              <input
                type="file"
                accept=".json"
                className={style.fileInput}
                onChange={handleImport}
              />
            </label>
          </div>
        </section>
      </div>

      <div className={style.bottomBar}>
        <p className={style.text}>HF — Hugo Finances · v1.0 · © 2026</p>
        <p className={style.warning}>
          <FaCircleInfo />
          Vos données sont enregistrées uniquement dans ce navigateur. Effacer
          les données de navigation / des sites ou changer d'appareil les
          supprimera.
        </p>
        <a
          href="https://github.com/donhug"
          target="_blank"
          rel="noopener noreferrer"
          className={style.link}
          aria-label="GitHub d'Hugo"
        >
          <FaGithub />
        </a>
      </div>
    </footer>
  );
}

export default Footer;
