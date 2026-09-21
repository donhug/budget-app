import style from "./Header.module.css";
import LOGO from "../../assets/LOGO.png"

function Header() {
  return (
    <header className={style.header}>
      <button className={style.navToggle} aria-label="Menu">
        ☰
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
