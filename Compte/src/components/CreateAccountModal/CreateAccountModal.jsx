import { useState } from "react";
import { FaXmark, FaCircleInfo } from "react-icons/fa6";
import style from "./CreateAccountModal.module.css";
import { SAVINGS_CATALOG } from "../../constants/accounts";
import { getCatalogEntry } from "../../services/savings";
function CreateAccountModal({ onSubmit, onClose }) {
  const [catalogId, setCatalogId] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountBalance, setAccountBalance] = useState("");
  const [accountCeiling, setAccountCeiling] = useState("");
  const [accountRate, setAccountRate] = useState("");
  const [accountKind, setAccountKind] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("idle");

  const selectedEntry = getCatalogEntry(catalogId);
  const isNothingSelected = catalogId === "";
  const isOther = catalogId === "Autre";

  function handleValidate() {
    const errors = [];
    setError("");
    if (isNothingSelected) {
      setError("Vous n'avez rien sélectionné.");
      return;
    }
    if (Number(accountBalance) < 0) {
      setError("Le montant ne peut pas être négatif.");
      return;
    }
    if (accountName.trim() === "") errors.push("le nom du compte");
    if (accountKind === "") errors.push("la nature (livret ou placement)");
    if (errors.length > 0) {
      setError("Il manque : " + errors.join(", "));
      return;
    }

    setStatus("loading");
    setTimeout(() => {
      setStatus("success");
      setTimeout(() => {
        onSubmit({
          catalogId: isOther ? null : catalogId,
          accountName,
          accountBalance: Number(accountBalance),
          accountCeiling: accountCeiling === "" ? null : Number(accountCeiling),
          accountRate: accountRate === "" ? null : Number(accountRate),
          accountKind,
        });
      }, 400);
    }, 400);
  }
  function handleCatalogChange(e) {
    const selectedId = e.target.value;
    setCatalogId(selectedId);
    const catalogEntry = SAVINGS_CATALOG.find(
      (entry) => entry.id === selectedId,
    );
    if (!catalogEntry) {
      setAccountName("");
      setAccountCeiling("");
      setAccountRate("");
      setAccountKind("");
      return;
    }
    setAccountName(catalogEntry.label);
    setAccountCeiling(catalogEntry.ceiling ?? "");
    setAccountRate(catalogEntry.rate ?? "");
    setAccountKind(catalogEntry.kind);
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
        <h2 className={style.heading}>Ajouter un compte d'épargne</h2>
        <div className={style.warning}>
          <FaCircleInfo />
          <p>
            Livret : compte permettant de mettre de l’argent de côté et de
            percevoir des intérêts. <br />
            Placement (PEA, CTO, assurance-vie) : permet d’investir de l’argent
            dans des actifs financiers, comme des actions ou des obligations.
            L'application suit les montants versés, et non pas la valeur en
            bourse !
          </p>
        </div>
        <div className={style.field}>
          <label htmlFor="catalog">Type de compte</label>
          <select id="catalog" value={catalogId} onChange={handleCatalogChange}>
            <option value="">-- Sélectionnez un compte --</option>
            {SAVINGS_CATALOG.map((entry) => {
              return (
                <option key={entry.id} value={entry.id}>
                  {entry.label}
                </option>
              );
            })}
            <option value="Autre">Autre</option>
          </select>
        </div>

        <div className={style.field}>
          <label htmlFor="label">Nom du compte</label>
          <input
            id="label"
            type="text"
            disabled={isNothingSelected}
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
          />
        </div>
        <div className={style.field}>
          <label htmlFor="value">Montant sur le compte</label>
          <input
            id="value"
            type="number"
            disabled={isNothingSelected}
            value={accountBalance}
            min="0"
            onChange={(e) => setAccountBalance(e.target.value)}
          />
        </div>
        <div className={style.field}>
          <label htmlFor="ceiling">Plafond</label>
          <input
            id="ceiling"
            type="number"
            disabled={!(isOther || selectedEntry?.ceilingEditable)}
            value={accountCeiling}
            onChange={(e) => setAccountCeiling(e.target.value)}
          />
        </div>
        {accountKind !== "placement" && (
          <div className={style.field}>
            <label htmlFor="rate">Taux</label>
            <input
              id="rate"
              type="number"
              step="0.01"
              disabled={!(isOther || selectedEntry?.rateEditable)}
              value={accountRate}
              onChange={(e) => setAccountRate(e.target.value)}
            />
          </div>
        )}
        <div className={style.typeGroup}>
          <label className={style.radioLabel}>
            <input
              type="radio"
              name="type"
              value="livret"
              disabled={!isOther}
              checked={accountKind === "livret"}
              className={style.radioInput}
              onChange={(e) => setAccountKind(e.target.value)}
            />
            <span className={style.radioChip}>livret</span>
          </label>

          <label className={style.radioLabel}>
            <input
              type="radio"
              name="type"
              value="placement"
              disabled={!isOther}
              checked={accountKind === "placement"}
              className={style.radioInput}
              onChange={(e) => setAccountKind(e.target.value)}
            />
            <span className={style.radioChip}>placement</span>
          </label>
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
          {status === "idle" && "Ajouter le compte"}
          {status === "loading" && <span className={style.spinner} />}
          {status === "success" && <span className={style.checkmark}>✓</span>}
        </button>
      </div>
    </div>
  );
}
export default CreateAccountModal;
