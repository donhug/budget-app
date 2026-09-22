import { useState, useRef } from "react";
import style from "./Sidebar.module.css";
import LOGO from "../../assets/LOGO.png";

const links = ["Dashboard", "Modifications", "En Cours", "Epargne", "Compte"];

function Sidebar() {
  const [indicator, setIndicator] = useState(null);
  const navRef = useRef(null);

  function handleEnter(e) {
    const navTop = navRef.current.getBoundingClientRect().top;
    const linkRect = e.currentTarget.getBoundingClientRect();
    setIndicator({
      top: linkRect.top - navTop,
      height: linkRect.height,
    });
  }

  return (
    <aside className={style.sidebar}>
      <img src={LOGO} alt="Hugo Finances" className={style.logo} />

      <nav
        className={style.nav}
        ref={navRef}
        onMouseLeave={() => setIndicator(null)}
      >
        {indicator && (
          <span
            className={style.indicator}
            style={{ top: indicator.top, height: indicator.height }}
          />
        )}
        {links.map((label) => (
          <a
            key={label}
            href="#"
            className={style.link}
            onMouseEnter={handleEnter}
          >
            {label}
          </a>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
