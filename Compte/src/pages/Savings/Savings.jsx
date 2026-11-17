import style from "./Savings.module.css";
import CreateAccountModal from "../../components/CreateAccountModal/CreateAccountModal";
import { useState, useMemo } from "react";
import { FaPlus } from "react-icons/fa6";
import { getAccounts, setAccounts } from "../../services/storage";
import { useBudgetVersion } from "../../hooks/useBudgetVersion";
import { SAVINGS_CATALOG } from "../../constants/accounts";
function Savings() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dataVersion = useBudgetVersion();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const accounts = useMemo(() => getAccounts(), [dataVersion]);
  function handleCreateAccount({
    catalogId,
    accountName,
    accountBalance,
    accountCeiling,
    accountRate,
    accountKind,
  }) {
    const selectedEntry = SAVINGS_CATALOG.find(
      (entry) => entry.id === catalogId,
    );
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
        {accounts.map((ac) => (
          <p key={ac.id}>{ac.name}</p>
        ))}
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
