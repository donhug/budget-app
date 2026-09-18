import { formatMonth } from "../../utils/dates";
import styles from "./MonthSummary.module.css"
function MonthSummary({
  currentMonth,
  balance,
  previousMonth,
  carryOver,
  isFirstMonth,
}) {
  const currentMonthLabel = formatMonth(currentMonth);
  const previousMonthLabel = formatMonth(previousMonth);
  return (
    <div className={styles.card}>
      <h2 className={styles.month}>{currentMonthLabel}</h2>
      <div className={styles.row}>
        {!isFirstMonth && (
          <p className={styles.carryOver}>
            Reste de {previousMonthLabel} :{" "}
            {carryOver === null ? "-" : `${carryOver}€`}
          </p>
        )}
        <p className={styles.balance}>
          <span className={styles.balanceLabel}>Solde</span>
          <span className={styles.balanceValue}>{balance === null ? "-" : `${balance}€`}</span>
        </p>
      </div>
    </div>
  );
}
export default MonthSummary;
