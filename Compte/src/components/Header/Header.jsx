import style from "./Header.module.css";
import LOGO from "../../assets/LOGO.png";
import { FaBars } from "react-icons/fa6";
function Header({ onMenuClick }) {
  return (
    <header className={style.header}>
      <button
        className={style.navToggle}
        aria-label="Menu"
        onClick={onMenuClick}
      >
        <FaBars />
      </button>
      <div className={style.logoGroup}>
        <img src={LOGO} alt="" className={style.logo} />
        <span className={style.divider} />
        <h1 className={style.appName}>HF</h1>
      </div>
    </header>
  );
}
export default Header;
