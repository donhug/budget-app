import style from "./Savings.module.css";
import CreateAccountModal from "../../components/CreateAccountModal/CreateAccountModal";
import { useState, useMemo } from "react";
import { Link } from "react-router";
import { FaPlus } from "react-icons/fa6";
import { getAccounts, setAccounts } from "../../services/storage";
import { useBudgetVersion } from "../../hooks/useBudgetVersion";
import {
  getCatalogEntry,
  getAccountBalance,
  getAccountFillPercent,
} from "../../services/savings";
import { formatBalance } from "../../utils/format";
import DeleteAccountConfirmation from "../../components/DeleteAccountConfirmation/DeleteAccountConfirmation";
function Savings() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dataVersion = useBudgetVersion();
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isConfirmDelete, setIsConfirmDelete] = useState(false);
  const selectedCount = selectedIds.length;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const accounts = useMemo(() => getAccounts(), [dataVersion]);
  const accountNames = accounts
    .filter((account) => selectedIds.includes(account.id))
    .map((account) => account.name)
    .join(", ");
  /**
   * Construit un compte d'épargne à partir des valeurs de la modale, puis l'ajoute à la liste.
   * Le plafond et le taux ne sont stockés que si l'utilisateur pouvait les modifier
   * (compte « Autre », ou entrée du catalogue avec `ceilingEditable` / `rateEditable`).
   * Sinon ils restent à `null` et sont relus dans le catalogue (voir services/savings.js),
   * pour suivre les changements de taux officiels.
   *
   * @param {object} values - les valeurs envoyées par CreateAccountModal
   */
  function handleCreateAccount({
    catalogId,
    accountName,
    accountBalance,
    accountCeiling,
    accountRate,
    accountKind,
  }) {
    const selectedEntry = getCatalogEntry(catalogId);
    const newAccount = {
      id: crypto.randomUUID(),
      catalogId,
      name: accountName,
      initialBalance: accountBalance,
      kind: accountKind,
      ceiling:
        selectedEntry?.ceilingEditable || catalogId === null
          ? accountCeiling
          : null,
      rate:
        selectedEntry?.rateEditable || catalogId === null ? accountRate : null,
    };
    const currentAccounts = getAccounts();
    const accountsUpdated = [...currentAccounts, newAccount];
    setAccounts(accountsUpdated);
    setIsModalOpen(false);
  }
  function handleToggleDeleteMode() {
    setIsDeleteMode(!isDeleteMode);
    setSelectedIds([]);
    setIsConfirmDelete(false);
  }
  function handleToggleSelected(id) {
    const isAlreadySelected = selectedIds.includes(id);
    const newSelection = isAlreadySelected
      ? selectedIds.filter((selectedId) => selectedId !== id)
      : [...selectedIds, id];
    setSelectedIds(newSelection);
  }

  return (
    <div className={style.page}>
      <h2 className={style.title}>Épargnes</h2>
      <div>
        <button type="button" onClick={handleToggleDeleteMode}>
          {isDeleteMode ? "Fermer" : "Supprimer des comptes"}
        </button>
        {isDeleteMode && selectedIds.length !== 0 && (
          <button type="button" onClick={() => setIsConfirmDelete(true)}>
            Supprimer ({selectedCount})
          </button>
        )}
      </div>

      <div className={style.grid}>
        {accounts.map((account) => {
          const balance = formatBalance(getAccountBalance(account));
          const percent = getAccountFillPercent(account);
          const isOverCeiling = percent !== null && percent >= 100;
          const isSelected = selectedIds.includes(account.id);
          const tileContent = (
            <>
              <p className={style.accountName}>{account.name}</p>
              {percent !== null ? (
                <div
                  className={`${style.ring} ${isOverCeiling ? style.over : ""}`}
                  style={{ "--percent": Math.min(percent, 100) }}
                >
                  <span className={style.ringValue}>{percent}%</span>
                </div>
              ) : (
                <p className={style.bigAmount}>{balance}</p>
              )}
              <p className={style.accountBalance}>
                {account.kind === "livret" ? "Solde : " : "Montant versé : "}
                {balance}
              </p>
            </>
          );
          return !isDeleteMode ? (
            <Link
              key={account.id}
              className={style.accountTile}
              to={`/savings/${account.id}`}
            >
              {tileContent}
            </Link>
          ) : (
            <button
              key={account.id}
              className={`
                ${style.accountTile} 
                ${isDeleteMode ? style.deleteMode : ""} 
                ${isSelected ? style.selected : ""}
              `}
              type="button"
              onClick={() => handleToggleSelected(account.id)}
            >
              {tileContent}
            </button>
          );
        })}
        <button
          type="button"
          className={style.addTile}
          onClick={() => setIsModalOpen(true)}
          disabled={isDeleteMode}
        >
          <FaPlus className={style.addIcon} />
          Ajouter un compte ou une épargne
        </button>
      </div>
      {isModalOpen && (
        <CreateAccountModal
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateAccount}
        />
      )}
      {isConfirmDelete && (
        <DeleteAccountConfirmation
          names={accountNames}
          onCancel={() => setIsConfirmDelete(false)}
          onDeleteAccount=""
        />
      )}
    </div>
  );
}

export default Savings;
