import './App.css'
import { generateMonths, getBalance } from './services/budget'
import { getCurrentMonth } from './utils/dates'
import { useEffect, useState } from 'react'

function App() {
  const currentMonth = getCurrentMonth();
  const [balance, setBalance] = useState(null);

  useEffect(() => { 
    generateMonths(); 
    setBalance(getBalance(currentMonth));

  },[currentMonth])

  return (
    <div>
      <p>Mois  :  {currentMonth}</p>
      <p>solde  :  {balance}</p>
    </div>
  )
}

export default App
