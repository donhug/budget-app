import style from "./EditModal.module.css";
import { useState } from "react";
import MonthPicker from "../MonthPicker/MonthPicker";
import { getNextMonth } from "../../utils/dates";
import { getCurrentMonth } from "../../utils/dates";

function EditModal({ rule, onClose, onSubmit }) {
  const [label, setLabel] = useState(rule.label);
  const [value, setValue] = useState(Math.abs(rule.value));
  const [type, setType] = useState(rule.type);
  const [startMonth, setStartMonth] = useState(rule.start);
  const [endMonth, setEndMonth] = useState(
    rule.end ? rule.end : getNextMonth(rule.start),
  );
  const [hasEndDate, setHasEndDate] = useState(rule.end !== null);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("idle");
  const currentMonth = getCurrentMonth();
  const hasStarted = currentMonth >= rule.start;
  function handleValidate() {}
  return (
    <div className={style.overlay}>
      <div className={style.modal}>
        <button className={style.closeBtn} type="button" onClick={onClose}>
          X
        </button>
        <h2 className={style.heading}>Modifier la règle</h2>
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
              className={style.radioInput}
              onChange={(e) => setType(e.target.value)}
            />
            <span className={style.radioChip}>Dépense</span>
          </label>

          <label className={style.radioLabel}>
            <input
              type="radio"
              name="type"
              value="income"
              checked={type === "income"}
              className={style.radioInput}
              onChange={(e) => setType(e.target.value)}
            />
            <span className={style.radioChip}>Entrée</span>
          </label>
        </div>

        <div className={style.field}>
          {!hasStarted && (
            <div>
              <p>date de début</p>
              <MonthPicker value={startMonth} onChange={setStartMonth} />
            </div>
          )}

          <label className={style.checkboxLabel}>
            <input
              type="checkbox"
              checked={hasEndDate}
              onChange={(e) => {
                setHasEndDate(e.target.checked);
                if (e.target.checked) {
                  setEndMonth(getNextMonth(startMonth));
                }
              }}
            />
            date de fin
          </label>
          {hasEndDate ? (
            <MonthPicker value={endMonth} onChange={setEndMonth} />
          ) : (
            <p>pas de date de fin fixe</p>
          )}
        </div>

        <button
          type="button"
          className={style.submitBtn}
          onClick={handleValidate}
          disabled={status !== "idle"}
        >
          {status === "idle" && "Enregistrer"}
          {status === "loading" && <span className={style.spinner} />}
          {status === "success" && <span className={style.checkmark}>✓</span>}
        </button>
      </div>
    </div>
  );
}

export default EditModal;
