import './App.css'
import { generateMonths, getBalance } from './services/budget'
import { getOperations } from './services/storage';
import { getCurrentMonth } from './utils/dates'
import { useEffect, useState } from 'react'

function App() {
  const currentMonth = getCurrentMonth();
  const [balance, setBalance] = useState(null);
  const [monthOperation, setMonthOperation] = useState([]);

  useEffect(() => { 
    generateMonths(); 
    setBalance(getBalance(currentMonth));
    setMonthOperation(getOperations(currentMonth));

  },[currentMonth])

  const monthlyOps = monthOperation.filter(op => op.origin === "rule");
  const ponctualOps = monthOperation.filter(op => op.origin === "manual");

  return (

    <section>
      
      <div>
        <p>Mois  :  {currentMonth}</p>
        <p>solde  :  {balance}€ </p>
      </div>

    <div>
      <p>Opération mensuelle : </p>
      {monthlyOps.map((op) => 
      <p key = {op.id}>{op.label} : {op.value}€</p>
      )}
    </div>
    <div>
      <p>Opération ponctuelle : </p>
      {ponctualOps.map((op) => 
      <p key = {op.id}>{op.label} : {op.value}€</p>
      )}
    </div>
    </section>
  )
}

export default App
