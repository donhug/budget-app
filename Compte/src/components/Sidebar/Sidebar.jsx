import style from "./Sidebar.module.css";
import  LOGO  from "../../assets/LOGO.png";

function Sidebar() {
  return (
    <aside className={style.sidebar}>
      <img src={LOGO} alt="Hugo Finances" className={style.logo} />
      <nav className={style.nav}>
        <a href="#" className={style.link}>
          Dashboard
        </a>
        <a href="#" className={style.link}>
          Modifications
        </a>
        <a href="#" className={style.link}>
          En Cours
        </a>
        <a href="#" className={style.link}>
          Epargne
        </a>
        <a href="#" className={style.link}>
          Compte
        </a>
      </nav>
    </aside>
  );
}

export default Sidebar;
