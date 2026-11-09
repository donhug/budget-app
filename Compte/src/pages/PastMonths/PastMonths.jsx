import style from "./PastMonths.module.css";
import { useParams, Navigate } from "react-router";
import {
  formatMonth,
  getCurrentMonth,
  getMonthState,
  isMonthKey,
} from "../../utils/dates";
import NotFound from "../NotFound/NotFound";
import { getFirstMonth } from "../../services/storage";
import { MONTHS_STATE } from "../../constants/stateMonths";
function PastMonths() {
  const firstMonth = getFirstMonth();
  const currentMonth = getCurrentMonth();
  const { monthKey } = useParams();
  if (!isMonthKey(monthKey)) {
    return <NotFound />;
  }
  const monthState = getMonthState(monthKey, firstMonth, currentMonth);
  if (monthState === MONTHS_STATE.current) {
    return <Navigate to="/month" replace />;
  }
  if (monthState !== MONTHS_STATE.past) {
    return <NotFound />;
  }
  const monthLabel = formatMonth(monthKey);
  return (
    <>
      <h2>{monthLabel}</h2>
    </>
  );
}
export default PastMonths;
