import { formatMonth } from "../../utils/dates";
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
    <div>
      <p>Mois : {currentMonthLabel}</p>
      <p>Solde : {balance === null ? "-" : `${balance}€`} </p>
      {!isFirstMonth && (
        <p>
          Reste de {previousMonthLabel} :{" "}
          {carryOver === null ? "-" : `${carryOver}€`}
        </p>
      )}
    </div>
  );
}
export default MonthSummary;
