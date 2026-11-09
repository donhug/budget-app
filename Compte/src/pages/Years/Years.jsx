import style from "./Years.module.css";
import { MONTHS } from "../../constants/months";
import { toMonthKey, getMonthState, getCurrentMonth } from "../../utils/dates";
import { getFirstMonth } from "../../services/storage";
import { Link } from "react-router";
import { MONTHS_STATE } from "../../constants/stateMonths";
function Years() {
  const firstMonth = getFirstMonth();
  const currentMonth = getCurrentMonth();
  const year = new Date().getFullYear();
  return (
    <>
      <div>
        <h2>Année</h2>
        <ul>
          {MONTHS.map((month, index) => {
            const monthKey = toMonthKey(year, index + 1);
            const state = getMonthState(monthKey, firstMonth, currentMonth);
            const isClickable =
              state === MONTHS_STATE.past || state === MONTHS_STATE.current;
            const linkDestination =
              state === MONTHS_STATE.current ? "/month" : `/month/${monthKey}`;
            return (
              <li key={monthKey} className={style[state]}>
                {isClickable ? (
                  <Link to={linkDestination} aria-current="date">
                    {month}
                  </Link>
                ) : (
                  <span>{month}</span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}

export default Years;
