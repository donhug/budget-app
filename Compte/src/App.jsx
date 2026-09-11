import './App.css'
import { generateMonths, getBalance, getMonthTotal, materializeRules } from './services/budget'
import { getOperations, setOperations, setRules, getRules } from './services/storage';
import { getCurrentMonth, getPreviousMonth } from './utils/dates'
import { useEffect, useState } from 'react'

function App() {
  const currentMonth = getCurrentMonth();
  const previousMonth = getPreviousMonth(currentMonth);
  const [balance, setBalance] = useState(null);
  const [monthOperation, setMonthOperation] = useState([]);
  const [carryOver, setCarryOver] = useState(null);
  const [isModaleOpen, setIsModaleOpen] = useState(false);
  const [label, setLabel] = useState("");
  const [value, setValue] = useState("");
  const [type, setType] = useState("");
  const [isRecurrent, setIsRecurrent] = useState(false);
  const [endMonth, setEndMonth] = useState("");
  const [error, setError] = useState("")

  function handleSubmit() {
    const rawAmount = Number(value);
    const amount = type === "depense" ? -rawAmount : rawAmount;
    const endOperation = endMonth === "" ? null : endMonth;
    const errors = []; // collection des erreurs 
    setError("")

    if(label.trim() === "") errors.push("le libellé");
    if(rawAmount === 0 ) errors.push("le montant");
    if(type === "") errors.push("la nature (dépense ou entrée)");

    if(errors.length > 0 ){
      setError("Il manque : " + errors.join(", "));
      return
    }

    if(isRecurrent){
      const newRule = {
        id : crypto.randomUUID(),
        label,
        value : amount,
        type,
        start : currentMonth,
        end : endOperation,
      }
      const currentRules = getRules();
      const upDateRules = [...currentRules, newRule];
      setRules(upDateRules);
      const NewOperation = materializeRules(currentMonth, [newRule]);
      const currentOperation = getOperations(currentMonth)
      const updatedOperation = [...currentOperation, ...NewOperation];
      setOperations(currentMonth, updatedOperation);
      setMonthOperation(getOperations(currentMonth));
      setBalance(getBalance(currentMonth));
    }else{
      const newOperation = {
        id : crypto.randomUUID(),
        label,
        value : amount,
        type,
        origin : "manual",
      }
      const currentOperations = getOperations(currentMonth);
      const upDateOperations = [...currentOperations, newOperation];
      setOperations(currentMonth, upDateOperations)
      setMonthOperation(getOperations(currentMonth));
      setBalance(getBalance(currentMonth));
    }
    setIsModaleOpen(false);
    setLabel("");
    setValue("");
    setType("");
    setIsRecurrent(false);
    setEndMonth("");
  }

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
            <button type='button' onClick={() => setIsModaleOpen(false)}>X</button>
            <input type="text" value={label} onChange={(e) => setLabel(e.target.value)} />
            <input type="number" value={value} onChange={(e) => setValue(e.target.value)}/>
            <label>
              <input 
                type="radio"
                name="type"
                value="depense"
                checked={type === "depense"}
                onChange={(e) => setType(e.target.value)}
              />
              Dépense
            </label>
            
            <label>
              <input
                type="radio"
                name="type"
                value="income"
                checked={type === "income"}
                onChange={(e) => setType(e.target.value)}
              />
              Entrée 
            </label>
            <label>
              <input
                type="checkbox"
                checked={isRecurrent}
                onChange={(e) => setIsRecurrent(e.target.checked)}
              />
              Opération récurrente  
            </label>
            {isRecurrent &&(
              <div>
                <p>date de fin</p>
              <input
              type="month"
              value={endMonth}
              onChange={(e) => setEndMonth(e.target.value)}
              />
              </div>
            )}
            {error && <p>{error}</p>}
            <button type='button' onClick={handleSubmit}>ajouter l'operation</button>
          </div>
        )}
      </div>

    <div>
      <h2>Opérations mensuelles : </h2>
      {monthlyOps.map((op) => 
      <p key = {op.id}>{op.label} : {op.value}€</p>
      )}
      <h3>total Mensuelles : {monthlyTotal}€</h3>
    </div>
    <div>
      <h2>Opérations ponctuelles : </h2>
      {ponctualOps.map((op) => 
      <p key = {op.id}>{op.label} : {op.value}€</p>
      )}
      <h3>total Ponctuelles : {ponctualTotal}€</h3>
    </div>
    </section>
  )
}

export default App
