function MonthSummary({ currentMonth, balance, previousMonth, carryOver, isFirstMonth }) {
  return (
    <div>
      <p>Mois : {currentMonth}</p>
      <p>Solde : {balance}€ </p>
      {!isFirstMonth && (
        <p>
          Reste de {previousMonth} : {carryOver}€
        </p>
      )}
    </div>
  );
}
export default MonthSummary;
