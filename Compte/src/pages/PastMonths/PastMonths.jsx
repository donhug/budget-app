import styles from "./PastMonths.module.css";
import { useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { useParams, Navigate } from "react-router";
import {
  getCurrentMonth,
  getMonthState,
  isMonthKey,
  getPreviousMonth,
} from "../../utils/dates";
import NotFound from "../NotFound/NotFound";
import { getFirstMonth, getOperations } from "../../services/storage";
import { MONTHS_STATE } from "../../constants/stateMonths";
import { getBalance, getMonthTotal } from "../../services/budget";
import OperationList from "../../components/OperationList/OperationList";
import MonthSummary from "../../components/MonthSummary/MonthSummary";
import PastManualModal from "../../components/PastManualModal/PastManualModal";
function PastMonths() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const firstMonth = getFirstMonth();
  const currentMonth = getCurrentMonth();
  const { monthKey } = useParams();
  const lastMonth = getPreviousMonth(monthKey);
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
  const pastOperations = getOperations(monthKey);
  const pastMonthlyOps = pastOperations.filter((op) => op.origin === "rule");
  const pastManualOps = pastOperations.filter((op) => op.origin === "manual");
  const pastBalance = getBalance(monthKey);
  const pastMonthOpTotal = getMonthTotal(pastManualOps);
  const pastMonthRlTotal = getMonthTotal(pastMonthlyOps);
  const lastCarryOver = getBalance(lastMonth);
  const isFirstMonth = firstMonth === monthKey;
  return (
    <>
      <div>
        <div>
          <MonthSummary
            currentMonth={monthKey}
            balance={pastBalance}
            previousMonth={lastMonth}
            carryOver={lastCarryOver}
            isFirstMonth={isFirstMonth}
          />
          <button
            className={styles.addBtn}
            onClick={() => setIsModalOpen(true)}
          >
            <FaPlus /> AJOUTER
          </button>
          {isModalOpen && (
          <PastManualModal
            onSubmit={() => setIsModalOpen(false)}
            onClose={() => setIsModalOpen(false)}
          />
        )}
        </div>
        <div>
          <OperationList
            title="Opérations mensuelles : "
            operations={pastMonthlyOps}
            total={pastMonthRlTotal}
          />
        </div>
        <div>
          <OperationList
            title="Opérations ponctuelles : "
            operations={pastManualOps}
            total={pastMonthOpTotal}
          />
        </div>
      </div>
    </>
  );
}
export default PastMonths;
