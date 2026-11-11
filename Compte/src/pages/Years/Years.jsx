import style from "./Years.module.css";
import { MONTHS } from "../../constants/months";
import {
  toMonthKey,
  isYearKey,
  getMonthState,
  getCurrentMonth,
  parseMonthKey,
  getListYears,
} from "../../utils/dates";
import NotFound from "../NotFound/NotFound";
import { getFirstMonth } from "../../services/storage";
import { Link, useParams, Navigate } from "react-router";
import { MONTHS_STATE } from "../../constants/stateMonths";
function Years() {
  const { year } = useParams();
  const firstMonth = getFirstMonth();
  const currentMonth = getCurrentMonth();
  const currentYear = new Date().getFullYear();
  const firstYear =
    firstMonth === null ? currentYear : parseMonthKey(firstMonth).year;
  if (!year) {
    return <Navigate to={`/calendar/${currentYear}`} replace />;
  }
  if (!isYearKey(year)) {
    return <NotFound />;
  }
  const displayedYear = Number(year);
  if (displayedYear < firstYear || displayedYear > currentYear) {
    return <NotFound />;
  }
  const yearsList = getListYears(firstYear, currentYear);
  return (
    <>
      <div>
        <nav aria-label="Années">
          {yearsList.map((yearOption) => {
            return (
              <Link
                to={`/calendar/${yearOption}`}
                key={yearOption}
                aria-current={yearOption === displayedYear ? "page" : undefined}
              >
                {yearOption}
              </Link>
            );
          })}
        </nav>

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
