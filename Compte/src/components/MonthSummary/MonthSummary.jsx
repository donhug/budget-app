function MonthSummary({currentMonth, balance, previousMonth, carryOver}) {
  return (
    <div>
      <p>Mois : {currentMonth}</p>
      <p>Solde : {balance}€ </p>
      <p>
        Reste de {previousMonth} : {carryOver}€
      </p>
    </div>
  );
}
export default MonthSummary;
