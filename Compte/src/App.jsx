import './App.css'
import { generateMonths, getBalance, getMonthTotal } from './services/budget'
import { getOperations } from './services/storage';
import { getCurrentMonth, getPreviousMonth } from './utils/dates'
import { useEffect, useState } from 'react'

function App() {
  const currentMonth = getCurrentMonth();
  const previousMonth =getPreviousMonth(currentMonth);
  const [balance, setBalance] = useState(null);
  const [monthOperation, setMonthOperation] = useState([]);
  const [carryOver, setCarryOver] = useState(null);
  const [isModaleOpen, setIsModaleOpen] = useState(false)

  useEffect(() => { 
    generateMonths(); 
    setBalance(getBalance(currentMonth));
    setMonthOperation(getOperations(currentMonth));
    setCarryOver(getBalance(previousMonth));

  },[currentMonth, previousMonth])

  const monthlyOps = monthOperation.filter(op => op.origin === "rule");
  const ponctualOps = monthOperation.filter(op => op.origin === "manual");
  const monthlyTotal = getMonthTotal(monthlyOps)
  const ponctualTotal = getMonthTotal(ponctualOps)

  return (

    <section>
      
      <div>
        <p>Mois  :  {currentMonth}</p>
        <p>Solde  :  {balance}€ </p>
        <p>Reste de {previousMonth} : {carryOver}€</p>
        <button onClick={() => setIsModaleOpen(true)}>+AJOUTER</button>
        {isModaleOpen &&(
          <div>
            <button onClick={() => setIsModaleOpen(false)}>X</button>
            <p>coucou</p>
          </div>
        )}
      </div>

    <div>
      <p>Opération mensuelle : </p>
      {monthlyOps.map((op) => 
      <p key = {op.id}>{op.label} : {op.value}€</p>
      )}
      <p>total Mensuelle : {monthlyTotal}€</p>
    </div>
    <div>
      <p>Opération ponctuelle : </p>
      {ponctualOps.map((op) => 
      <p key = {op.id}>{op.label} : {op.value}€</p>
      )}
      <p>total Ponctuelle : {ponctualTotal}€</p>
    </div>
    </section>
  )
}

export default App
