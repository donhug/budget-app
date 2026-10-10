import style from "./NotFound.module.css";
import { Link } from "react-router";

function NotFound() {
  return (
    <div>
      <h1>404</h1>
      <p>La page que vous cherchez n'existe pas ou plus</p>
      <Link to="/">Retour à l'accueil</Link>
    </div>
  );
}
export default NotFound;
