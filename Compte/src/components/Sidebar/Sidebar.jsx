import { useState, useRef } from "react";
import { NavLink, useLocation } from "react-router";
import style from "./Sidebar.module.css";
import LOGO from "../../assets/LOGO.webp";
import { NAV_LINKS } from "../../constants/navLinks";
import {
  formatMonth,
  isMonthKey,
  getCurrentMonth,
  getMonthState,
} from "../../utils/dates";
import { getFirstMonth } from "../../services/storage";
import { MONTHS_STATE } from "../../constants/stateMonths";
function Sidebar() {
  const location = useLocation();
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
  const firstMonth = getFirstMonth();
  const currentMonth = getCurrentMonth();
  const path = location.pathname;
  const pathParts = path.split("/month/");
  const pastMonthKey =
    isMonthKey(pathParts[1]) &&
    getMonthState(pathParts[1], firstMonth, currentMonth) === MONTHS_STATE.past
      ? pathParts[1]
      : null;

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
            end={link.end}
            className={({ isActive }) =>
              `${style.link} ${isActive || (pastMonthKey && link.isHistory) ? style.active : ""}`
            }
            onMouseEnter={handleEnter}
          >
            {link.label}
            {link.isHistory && pastMonthKey && (
              <span className={style.subLabel}>
                {formatMonth(pastMonthKey)}
              </span>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
