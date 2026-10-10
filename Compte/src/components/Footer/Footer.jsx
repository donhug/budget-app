import style from "./Footer.module.css";
import { FaGithub, FaCircleInfo } from "react-icons/fa6";

function Footer() {
  return (
    <footer className={style.footer}>
      <p className={style.text}>HF — Hugo Finances · v1.0 · © 2026</p>
      <p className={style.warning}>
        <FaCircleInfo />
        Vos données sont enregistrées uniquement dans ce navigateur. Effacer les
        données de navigation / des sites ou changer d'appareil les supprimera.
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
    </footer>
  );
}

export default Footer;
