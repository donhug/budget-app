import style from "./TransferModal.module.css";
import { FaXmark } from "react-icons/fa6";
import { useState } from "react";
import { formatBalance } from "../../utils/format";

function TransferModal({
  accountName,
  balance,
  ceiling,
  mode,
  onSubmit,
  onClose,
}) {
  const [label, setLabel] = useState("");
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("idle");
  const isDeposit = mode === "deposit";
  const hasCeiling = ceiling !== null;
  const text = isDeposit
    ? `Versement vers ${accountName}`
    : `Retrait depuis ${accountName}`;

  function handleValidate() {
    const rawAmount = Math.abs(Number(value));
    const errors = [];
    setError("");

    if (rawAmount === 0) errors.push("Le montant ne peut pas être à zéro");
    if (isDeposit && hasCeiling && rawAmount + balance > ceiling) {
      const overCeiling = balance + rawAmount - ceiling;
      const formatOverCeiling = formatBalance(overCeiling);
      errors.push(
        `Ce versement dépasserait le plafond de ${formatOverCeiling}`,
      );
    }
    if (!isDeposit && rawAmount > balance)
      errors.push("Le retrait dépasse le solde de l'epargne");
    if (errors.length > 0) {
      setError("Erreur : " + errors.join(", "));
      return;
    }

    setStatus("loading");
    setTimeout(() => {
      setStatus("success");
      setTimeout(() => {
        onSubmit({
          label,
          amount: rawAmount,
        });
      }, 400);
    });
  }
  return (
    <div className={style.overlay}>
      <div className={style.modal}>
        <button
          className={style.closeBtn}
          type="button"
          onClick={onClose}
          aria-label="Fermer"
        >
          <FaXmark />
        </button>
        <h2 className={style.heading}>{text}</h2>
        <div className={style.field}>
          <label htmlFor="label">Libellé</label>
          <input
            id="label"
            type="text"
            placeholder={text}
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
        {error && (
          <p className={style.error} role="alert">
            {error}
          </p>
        )}
        <button
          type="button"
          className={style.submitBtn}
          onClick={handleValidate}
          disabled={status !== "idle"}
        >
          {status === "idle" && (isDeposit ? "Verser" : "Retirer")}
          {status === "loading" && <span className={style.spinner} />}
          {status === "success" && <span className={style.checkmark}>✓</span>}
        </button>
      </div>
    </div>
  );
}
export default TransferModal;
