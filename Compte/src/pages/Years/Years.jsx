import style from "./Years.module.css";
import { MONTHS } from "../../constants/months";
import {
  toMonthKey,
  isYearKey,
  getMonthState,
  getCurrentMonth,
  parseMonthKey,
} from "../../utils/dates";
import NotFound from "../NotFound/NotFound";
import { getFirstMonth } from "../../services/storage";
import { Link, useParams } from "react-router";
import { MONTHS_STATE } from "../../constants/stateMonths";
function Years() {
  const { year } = useParams();
  const firstMonth = getFirstMonth();
  const currentMonth = getCurrentMonth();
  const currentYear = new Date().getFullYear();
  const displayedYear = year ? Number(year) : currentYear;
  const firsthYear =
    firstMonth === null ? currentYear : parseMonthKey(firstMonth).year;
  if (year && !isYearKey(year)) {
    return <NotFound />;
  }
  if (displayedYear < firsthYear || displayedYear > currentYear) {
    return <NotFound />;
  }
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
