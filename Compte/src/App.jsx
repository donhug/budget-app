import "./App.css";
import MonthSummary from "./components/MonthSummary/MonthSummary";
import DeleteConfirmation from "./components/DeleteConfirmation/DeleteConfirmation";
import {
  generateMonths,
  getBalance,
  getMonthTotal,
  materializeRules,
} from "./services/budget";
import {
  getOperations,
  setOperations,
  setRules,
  getRules,
  deleteOperation,
  deleteRule,
} from "./services/storage";
import { getCurrentMonth, getPreviousMonth } from "./utils/dates";
import { useEffect, useState } from "react";

function App() {
  const currentMonth = getCurrentMonth();
  const previousMonth = getPreviousMonth(currentMonth);
  const [balance, setBalance] = useState(null);
  const [monthOperations, setMonthOperations] = useState([]);
  const [carryOver, setCarryOver] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [label, setLabel] = useState("");
  const [value, setValue] = useState("");
  const [type, setType] = useState("");
  const [isRecurrent, setIsRecurrent] = useState(false);
  const [endMonth, setEndMonth] = useState("");
  const [error, setError] = useState("");
  const [operationToDelete, setOperationToDelete] = useState(null);

  function handleSubmit() {
    const rawAmount = Number(value);
    const amount = type === "expense" ? -rawAmount : rawAmount;
    const ruleEnd = endMonth === "" ? null : endMonth;
    const errors = [];
    setError("");

    if (label.trim() === "") errors.push("le libellé");
    if (rawAmount === 0) errors.push("le montant");
    if (type === "") errors.push("la nature (dépense ou entrée)");

    if (errors.length > 0) {
      setError("Il manque : " + errors.join(", "));
      return;
    }

    if (isRecurrent) {
      const newRule = {
        id: crypto.randomUUID(),
        label,
        value: amount,
        type,
        start: currentMonth,
        end: ruleEnd,
      };
      const currentRules = getRules();
      const updatedRules = [...currentRules, newRule];
      setRules(updatedRules);
      const newOperation = materializeRules(currentMonth, [newRule]);
      const currentOperations = getOperations(currentMonth);
      const updatedRuleOperations = [...currentOperations, ...newOperation];
      setOperations(currentMonth, updatedRuleOperations);
      setMonthOperations(getOperations(currentMonth));
      setBalance(getBalance(currentMonth));
    } else {
      const newOperation = {
        id: crypto.randomUUID(),
        ruleId: null,
        label,
        value: amount,
        type,
        origin: "manual",
      };
      const currentOperations = getOperations(currentMonth);
      const updatedManualOperations = [...currentOperations, newOperation];
      setOperations(currentMonth, updatedManualOperations);
      setMonthOperations(getOperations(currentMonth));
      setBalance(getBalance(currentMonth));
    }
    setIsModalOpen(false);
    setLabel("");
    setValue("");
    setType("");
    setIsRecurrent(false);
    setEndMonth("");
  }

  function handleDeleteOperation(operationId) {
    deleteOperation(currentMonth, operationId);
    setMonthOperations(getOperations(currentMonth));
    setBalance(getBalance(currentMonth));
  }

  function handleDeleteRule() {
    deleteRule(operationToDelete.ruleId);
    handleDeleteOperation(operationToDelete.id);
    setOperationToDelete(null);
  }

  useEffect(() => {
    generateMonths();
    setBalance(getBalance(currentMonth));
    setMonthOperations(getOperations(currentMonth));
    setCarryOver(getBalance(previousMonth));
  }, [currentMonth, previousMonth]);

  const monthlyOps = monthOperations.filter((op) => op.origin === "rule");
  const manualOps = monthOperations.filter((op) => op.origin === "manual");
  const monthlyTotal = getMonthTotal(monthlyOps);
  const manualTotal = getMonthTotal(manualOps);

  return (
    <section>
      <div>
        <MonthSummary
          currentMonth={currentMonth}
          balance={balance}
          previousMonth={previousMonth}
          carryOver={carryOver}
        />
        <button onClick={() => setIsModalOpen(true)}>+AJOUTER</button>
        {isModalOpen && (
          <div>
            <button type="button" onClick={() => setIsModalOpen(false)}>
              X
            </button>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            <label>
              <input
                type="radio"
                name="type"
                value="expense"
                checked={type === "expense"}
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
            {isRecurrent && (
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
            <button type="button" onClick={handleSubmit}>
              ajouter l'operation
            </button>
          </div>
        )}
      </div>

      <div>
        <h2>Opérations mensuelles : </h2>
        {monthlyOps.map((op) => (
          <div key={op.id}>
            <p>
              {op.label} : {op.value}€
            </p>
            <button onClick={() => setOperationToDelete(op)}>supprimer</button>
          </div>
        ))}
        {operationToDelete && (
          <DeleteConfirmation
            label={operationToDelete.label}
            onDeleteOperation={() => {
              handleDeleteOperation(operationToDelete.id);
              setOperationToDelete(null);
            }}
            onDeleteRule={handleDeleteRule}
            onCancel={() => {
              setOperationToDelete(null);
            }}
          />
        )}
        <h3>total Mensuelles : {monthlyTotal}€</h3>
      </div>
      <div>
        <h2>Opérations ponctuelles : </h2>
        {manualOps.map((op) => (
          <div key={op.id}>
            <p>
              {op.label} : {op.value}€
            </p>
            <button type="button" onClick={() => handleDeleteOperation(op.id)}>
              {" "}
              supprimer l'operation
            </button>
          </div>
        ))}
        <h3>total Ponctuelles : {manualTotal}€</h3>
      </div>
    </section>
  );
}

export default App;
