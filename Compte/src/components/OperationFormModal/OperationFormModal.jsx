import { useState } from "react";
function OperationFormModal({ onSubmit, onClose }) {
  const [label, setLabel] = useState("");
  const [value, setValue] = useState("");
  const [type, setType] = useState("");
  const [isRecurrent, setIsRecurrent] = useState(false);
  const [endMonth, setEndMonth] = useState("");
  const [error, setError] = useState("");

  function handleValidate() {
    const rawAmount = Number(value);
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
    onSubmit({ label, amount, type, isRecurrent, endMonth });
  }
  return (
    <div>
      <button type="button" onClick={onClose}>
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
      <button type="button" onClick={handleValidate}>
        ajouter l'operation
      </button>
    </div>
  );
}
export default OperationFormModal;
