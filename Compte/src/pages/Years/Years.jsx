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
import { formatBalance } from "../../utils/format";
import { getBalance } from "../../services/budget";
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
    <div className={style.page}>
      <h2 className={style.title}>Historique</h2>
      <nav aria-label="Années" className={style.yearsNav}>
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

      <ul className={style.grid}>
        {MONTHS.map((month, index) => {
          const monthKey = toMonthKey(displayedYear, index + 1);
          const state = getMonthState(monthKey, firstMonth, currentMonth);
          const isClickable =
            state === MONTHS_STATE.past || state === MONTHS_STATE.current;
          const linkDestination =
            state === MONTHS_STATE.current ? "/month" : `/month/${monthKey}`;
          const monthBalance = isClickable ? getBalance(monthKey) : undefined;
          return (
            <li key={monthKey} className={style[state]}>
              {isClickable ? (
                <Link
                  to={linkDestination}
                  aria-current={
                    state === MONTHS_STATE.current ? "date" : undefined
                  }
                >
                  <span className={style.monthName}>{month}</span>
                  <span
                    className={`${style.amount} ${
                      monthBalance < 0 ? style.negative : style.positive
                    }`}
                  >
                    {formatBalance(monthBalance)}
                  </span>
                </Link>
              ) : (
                <span className={style.monthName}>{month}</span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Years;
