import { useState, useRef } from "react";
import { NavLink } from "react-router";
import style from "./Sidebar.module.css";
import LOGO from "../../assets/LOGO.png";

const links = [
  { label: "Dashboard", to: "/dashboard" },
  { label: "Modifications", to: "/rules-changes" },
  { label: "En Cours", to: "/" },
  { label: "Epargne", to: "/savings" },
  { label: "Compte", to: "/account" },
];

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
        {links.map((link) => (
          <NavLink
            key={link.label}
            to={link.to}
            className={style.link}
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
