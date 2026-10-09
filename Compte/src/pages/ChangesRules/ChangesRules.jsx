import { useEffect, useState } from "react";
import style from "./ChangesRules.module.css";
import {
  deleteOperation,
  deleteRule,
  getOperations,
  getRules,
  setOperations,
} from "../../services/storage";
import { formatMonth, getCurrentMonth } from "../../utils/dates";
import {
  groupRulesByStartMonth,
  materializeRules,
} from "../../services/budget";
import { setRules } from "../../services/storage";
import RuleList from "../../components/RuleList/RuleList";
import EditModal from "../../components/EditModal/EditModal";
import DeleteConfirmation from "../../components/DeleteConfirmation/DeleteConfirmation";

function ChangesRules() {
  const [globalRules, setGlobalRules] = useState([]);
  const [ruleToEdit, setRuleToEdit] = useState(null);
  const [ruleToDelete, setRuleToDelete] = useState(null);
  const currentMonth = getCurrentMonth();

  const currentRules = globalRules.filter(
    (rule) =>
      currentMonth >= rule.start &&
      (rule.end === null || currentMonth <= rule.end),
  );
  const futureRules = globalRules.filter((rule) => rule.start > currentMonth);
  const futureRulesByMonth = groupRulesByStartMonth(futureRules);
  const sortFutureMonth = Object.keys(futureRulesByMonth).sort();
  const terminatedRules = globalRules.filter(
    (rule) => rule.end !== null && rule.end < currentMonth,
  );

  useEffect(() => {
    setGlobalRules(getRules());
  }, []);

  function handleEditRule({ updatedRules, includeCurrentMonth }) {
    const editedRules = getRules().map((rule) =>
      rule.id === updatedRules.id ? updatedRules : rule,
    );
    setRules(editedRules);

    if (includeCurrentMonth) {
      const updateOperation = getOperations(currentMonth).map((op) =>
        op.ruleId === updatedRules.id
          ? {
              ...op,
              label: updatedRules.label,
              value: updatedRules.value,
              type: updatedRules.type,
            }
          : op,
      );
      setOperations(currentMonth, updateOperation);
    }

    if (ruleToEdit.start > currentMonth && updatedRules.start <= currentMonth) {
      const newOperation = materializeRules(currentMonth, [updatedRules]);
      const currentOperations = getOperations(currentMonth);
      const updatedRuleOperations = [...currentOperations, ...newOperation];
      setOperations(currentMonth, updatedRuleOperations);
    }
    setGlobalRules(getRules());
    setRuleToEdit(null);
  }

  function deleteCurrentOperationOfRule(ruleId) {
    const monthOperation = getOperations(currentMonth);
    const linkedOperation = monthOperation.find((op) => op.ruleId === ruleId);
    if (linkedOperation) {
      deleteOperation(currentMonth, linkedOperation.id);
    }
  }

  function handleDeleteRule() {
    deleteRule(ruleToDelete.id);
    deleteCurrentOperationOfRule(ruleToDelete.id);
    setGlobalRules(getRules());
    setRuleToDelete(null);
  }

  function handleDeleteRuleMonth() {
    deleteCurrentOperationOfRule(ruleToDelete.id);
    setRuleToDelete(null);
  }

  return (
    <div className={style.page}>
      <h2 className={style.title}>Modifications</h2>

      <section className={style.section}>
        <h3 className={style.sectionTitle}>Mois en cours</h3>
        <RuleList
          title={formatMonth(currentMonth)}
          rules={currentRules}
          onEdit={setRuleToEdit}
          onDelete={(rule) => setRuleToDelete(rule)}
        />
      </section>
      <section className={style.section}>
        <h3 className={style.sectionTitle}>À venir</h3>
        {futureRules.length === 0 ? (
          <p className={style.empty}>Aucune règle à venir</p>
        ) : (
          sortFutureMonth.map((month) => (
            <RuleList
              key={month}
              title={formatMonth(month)}
              rules={futureRulesByMonth[month]}
              onEdit={setRuleToEdit}
              onDelete={(rule) => setRuleToDelete(rule)}
            />
          ))
        )}
      </section>
      <section className={style.section}>
        <h3 className={style.sectionTitle}>Règles terminées</h3>
        <RuleList rules={terminatedRules} />
      </section>

      {ruleToEdit && (
        <EditModal
          rule={ruleToEdit}
          onClose={() => setRuleToEdit(null)}
          onSubmit={handleEditRule}
        />
      )}
      {ruleToDelete && (
        <DeleteConfirmation
          label={ruleToDelete.label}
          onDeleteOperation={
            ruleToDelete.start <= currentMonth
              ? handleDeleteRuleMonth
              : undefined
          }
          onDeleteRule={handleDeleteRule}
          onCancel={() => {
            setRuleToDelete(null);
          }}
        />
      )}
    </div>
  );
}
export default ChangesRules;
