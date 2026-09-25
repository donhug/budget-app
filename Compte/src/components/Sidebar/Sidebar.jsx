import { useState, useRef } from "react";
import { NavLink } from "react-router";
import style from "./Sidebar.module.css";
import LOGO from "../../assets/LOGO.png";
import { NAV_LINKS } from "../../constants/navLinks";

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
        {NAV_LINKS.map((link) => (
          <NavLink
            key={link.label}
            to={link.to}
            className={({ isActive }) =>
              `${style.link} ${isActive ? style.active : ""}`
            }
            onMouseEnter={handleEnter}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
