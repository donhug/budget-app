import style from "./MobileNav.module.css";
import { NavLink } from "react-router";
import { NAV_LINKS } from "../../constants/navLinks";

function MobileNav({ onClose }) {
  return (
    <div className={style.overlay} onClick={onClose}>
      <nav className={style.sheet} onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className={style.closeBtn}
          onClick={onClose}
          aria-label="Fermer le menu"
        >
          X
        </button>
        {NAV_LINKS.map((link) => (
          <NavLink
            key={link.label}
            to={link.to}
            className={({ isActive }) =>
              `${style.link} ${isActive ? style.active : ""}`
            }
            onClick={onClose}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
export default MobileNav;
