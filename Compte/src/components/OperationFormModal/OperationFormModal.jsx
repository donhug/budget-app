import { useState } from "react";
import style from "./OperationFormModal.module.css";
function OperationFormModal({ onSubmit, onClose }) {
  const [label, setLabel] = useState("");
  const [value, setValue] = useState("");
  const [type, setType] = useState("");
  const [isRecurrent, setIsRecurrent] = useState(false);
  const [endMonth, setEndMonth] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleValidate() {
    const rawAmount = Math.abs(Number(value));
    const amount = type === "expense" ? -rawAmount : rawAmount;
    const errors = [];
    setError("");

    if (label.trim() === "") errors.push("le libellé");
    if (rawAmount === 0) errors.push("le montant");
    if (type === "") errors.push("la nature (dépense ou entrée)");

    if (errors.length > 0) {
      setError("Il manque : " + errors.join(", "));
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      onSubmit({ label, amount, type, isRecurrent, endMonth });
    }, 400);
  }
  return (
    <div className={style.overlay}>
      <div className={style.modal}>
        <button className={style.closeBtn} type="button" onClick={onClose}>
          X
        </button>
        <h2 className={style.heading}>Ajoutee une opération</h2>
        <div className={style.field}>
          <label htmlFor="label">Libellé</label>
          <input
            id="label"
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </div>
        <div className={style.field}>
          <label htmlFor="value">Montant</label>
          <input
            id="value"
            type="number"
            value={value}
            min="0"
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
        <div className={style.typeGroup}>
          <label className={style.radioLabel}>
            <input
              type="radio"
              name="type"
              value="expense"
              checked={type === "expense"}
              onChange={(e) => setType(e.target.value)}
            />
            Dépense
          </label>

          <label className={style.radioLabel}>
            <input
              type="radio"
              name="type"
              value="income"
              checked={type === "income"}
              onChange={(e) => setType(e.target.value)}
            />
            Entrée
          </label>
        </div>

        <label className={style.checkBoxLabel}>
          <input
            type="checkbox"
            checked={isRecurrent}
            onChange={(e) => setIsRecurrent(e.target.checked)}
          />
          Opération récurrente
        </label>
        {isRecurrent && (
          <div className={style.field}>
            <label htmlFor="endMonth">date de fin</label>
            <input
              id="endMonth"
              type="month"
              value={endMonth}
              onChange={(e) => setEndMonth(e.target.value)}
            />
          </div>
        )}
        {error && <p className={style.error}>{error}</p>}
        <button
          type="button"
          className={style.submitBtn}
          onClick={handleValidate}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Ajout en cours...." : "ajouter l'operation"}
        </button>
      </div>
    </div>
  );
}
export default OperationFormModal;
