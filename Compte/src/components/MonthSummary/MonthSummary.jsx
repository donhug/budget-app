import { formatMonth } from "../../utils/dates";
import { formatBalance } from "../../utils/format";
import styles from "./MonthSummary.module.css";
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
        {isFirstMonth === false && (
          <p className={styles.carryOver}>
            Reste de {previousMonthLabel} :{" "}
            {carryOver === null ? "-" : formatBalance(carryOver)}
          </p>
        )}
        <p className={styles.balance}>
          <span className={styles.balanceLabel}>Solde</span>
          <span className={styles.balanceValue}>
            {balance === null ? "-" : formatBalance(balance)}
          </span>
        </p>
      </div>
    </div>
  );
}
export default MonthSummary;
