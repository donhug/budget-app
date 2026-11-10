import style from "./Years.module.css";
import { MONTHS } from "../../constants/months";
import { toMonthKey, getMonthState, getCurrentMonth } from "../../utils/dates";
import { getFirstMonth } from "../../services/storage";
import { Link, useParams } from "react-router";
import { MONTHS_STATE } from "../../constants/stateMonths";
function Years() {
  const { year } = useParams();
  const firstMonth = getFirstMonth();
  const currentMonth = getCurrentMonth();
  const displayedYear = year ? Number(year) : new Date().getFullYear();
  return (
    <>
      <div>
        <h2>{displayedYear}</h2>
        <ul>
          {MONTHS.map((month, index) => {
            const monthKey = toMonthKey(displayedYear, index + 1);
            const state = getMonthState(monthKey, firstMonth, currentMonth);
            const isClickable =
              state === MONTHS_STATE.past || state === MONTHS_STATE.current;
            const linkDestination =
              state === MONTHS_STATE.current ? "/month" : `/month/${monthKey}`;
            return (
              <li key={monthKey} className={style[state]}>
                {isClickable ? (
                  <Link
                    to={linkDestination}
                    aria-current={
                      state === MONTHS_STATE.current ? "date" : undefined
                    }
                  >
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
