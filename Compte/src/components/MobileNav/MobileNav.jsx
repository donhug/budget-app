import style from "./MobileNav.module.css";
const links = ["Dashboard", "Modifications", "En Cours", "Epargne", "Compte"];
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
        {links.map((label) => (
          <a key={label} href="#" className={style.link} onClick={onClose}>
            {label}
          </a>
        ))}
      </nav>
    </div>
  );
}
export default MobileNav;
