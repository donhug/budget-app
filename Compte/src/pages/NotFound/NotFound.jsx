import style from "./NotFound.module.css";
import { Link } from "react-router";
import img_404 from "../../assets/404.png";

function NotFound() {
  return (
    <div className={style.main}>
      <img
        className={style.img}
        src={img_404}
        alt="Écureuil cowboy stressé, les poches vides"
      />
      <h2 className={style.title}>404</h2>
      <p className={style.text}>
        La page que tu cherches n'existe pas ou plus 
      </p>
      <Link to="/" className={style.link}>
        Retour à l'accueil
      </Link>
    </div>
  );
}
export default NotFound;
