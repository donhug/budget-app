import style from "./Savings.module.css";
import CreateAccountModal from "../../components/CreateAccountModal/CreateAccountModal";
import { useState, useMemo } from "react";
import { FaPlus } from "react-icons/fa6";
import { getAccounts, setAccounts } from "../../services/storage";
import { useBudgetVersion } from "../../hooks/useBudgetVersion";
import {
  getCatalogEntry,
  getAccountCeiling,
  getAccountRate,
  getAccountBalance,
  getAccountFillPercent,
} from "../../services/savings";
import { formatBalance } from "../../utils/format";
function Savings() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dataVersion = useBudgetVersion();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const accounts = useMemo(() => getAccounts(), [dataVersion]);
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

  return (
    <div className={style.page}>
      <h2 className={style.title}>Épargnes</h2>
      <div className={style.grid}>
        <button
          type="button"
          className={style.addTile}
          onClick={() => setIsModalOpen(true)}
        >
          <FaPlus className={style.addIcon} />
          Ajouter un compte ou une épargne
        </button>
        {accounts.map((account) => {
          const rate = getAccountRate(account);
          const ceiling = getAccountCeiling(account);
          const balance = formatBalance(getAccountBalance(account));
          const percent = getAccountFillPercent(account);
          const isOverCeiling = percent !== null && percent >= 100;
          return (
            <div key={account.id} className={style.addTile}>
              <p>{account.name}</p>
              {rate !== null && <p>Taux : {rate} %</p>}
              {ceiling !== null && <p>Plafond :{formatBalance(ceiling)}</p>}
              <p>
                {account.kind === "livret" ? "Solde" : "Montant versé"}:
                {balance}
              </p>
              {percent !== null && (
                <p className={isOverCeiling ? style.over : undefined}>
                  {percent}%
                </p>
              )}
            </div>
          );
        })}
      </div>
      {isModalOpen && (
        <CreateAccountModal
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateAccount}
        />
      )}
    </div>
  );
}

export default Savings;
