import styles from "./App.module.css";
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
  getFirstMonth,
} from "./services/storage";
import { getCurrentMonth, getPreviousMonth } from "./utils/dates";
import { useEffect, useState } from "react";
import OperationList from "./components/OperationList/OperationList";
import OperationFormModal from "./components/OperationFormModal/OperationFormModal";
import Header from "./components/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar";
import MobileNav from "./components/MobileNav/MobileNav";

function App() {
  const currentMonth = getCurrentMonth();
  const previousMonth = getPreviousMonth(currentMonth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [balance, setBalance] = useState(null);
  const [monthOperations, setMonthOperations] = useState([]);
  const [carryOver, setCarryOver] = useState(null);
  const [operationToDelete, setOperationToDelete] = useState(null);
  const [isFirstMonth, setIsFirstMonth] = useState(null);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isReady, setIsReady] = useState(false);

  function refreshMonth() {
    setMonthOperations(getOperations(currentMonth));
    setBalance(getBalance(currentMonth));
  }
  function handleSubmit({ label, amount, type, isRecurrent, endMonth }) {
    const ruleEnd = endMonth === "" ? null : endMonth;

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
      refreshMonth();
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
      refreshMonth();
    }
    setIsModalOpen(false);
  }

  function handleDeleteOperation(operationId) {
    deleteOperation(currentMonth, operationId);
    refreshMonth();
  }

  function handleDeleteRule() {
    deleteRule(operationToDelete.ruleId);
    handleDeleteOperation(operationToDelete.id);
    setOperationToDelete(null);
  }

  useEffect(() => {
    setBalance(getBalance(currentMonth));
    setMonthOperations(getOperations(currentMonth));
    setCarryOver(getBalance(previousMonth));
    setIsFirstMonth(getFirstMonth() === currentMonth);
  }, [currentMonth, previousMonth]);

  useEffect(() => {
    generateMonths();
    setIsReady(true);
  }, []);

  const monthlyOps = monthOperations.filter((op) => op.origin === "rule");
  const manualOps = monthOperations.filter((op) => op.origin === "manual");
  const monthlyTotal = getMonthTotal(monthlyOps);
  const manualTotal = getMonthTotal(manualOps);

  return (
    <div className={styles.layoutWrapper}>
      <Sidebar />
      <div className={styles.mainColumn}>
        <Header onMenuClick={() => setIsNavOpen(true)} />
        {isNavOpen && <MobileNav onClose={() => setIsNavOpen(false)} />}
        <section className={styles.appShell}>
          <div>
            <MonthSummary
              currentMonth={currentMonth}
              balance={balance}
              previousMonth={previousMonth}
              carryOver={carryOver}
              isFirstMonth={isFirstMonth}
            />
            <button
              className={styles.addBtn}
              onClick={() => setIsModalOpen(true)}
            >
              +AJOUTER
            </button>
            {isModalOpen && (
              <OperationFormModal
                onSubmit={handleSubmit}
                onClose={() => setIsModalOpen(false)}
              />
            )}
          </div>
          <div className={styles.listsGrid}>
            <div>
              <OperationList
                title="Opérations mensuelles : "
                operations={monthlyOps}
                total={monthlyTotal}
                onDelete={(op) => setOperationToDelete(op)}
              />
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
            </div>
            <div>
              <OperationList
                title="Opérations ponctuelles : "
                operations={manualOps}
                total={manualTotal}
                onDelete={(op) => handleDeleteOperation(op.id)}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;
