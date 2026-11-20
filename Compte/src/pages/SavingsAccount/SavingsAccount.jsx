import style from "./SavingsAccount.module.css";
import { useParams } from "react-router";
import NotFound from "../NotFound/NotFound";
import { getAccounts } from "../../services/storage";
import { useMemo, useState } from "react";
import {
  getAccountCeiling,
  getAccountRate,
  getInterest,
  getAccountBalance,
} from "../../services/savings";
import { useBudgetVersion } from "../../hooks/useBudgetVersion";
import { formatBalance } from "../../utils/format";
import { FaArrowDown, FaArrowUp } from "react-icons/fa6";
import TransferModal from "../../components/TransferModal/TransferModal";
import { getCurrentMonth } from "../../utils/dates";
import { getOperations, setOperations } from "../../services/storage";
function SavingsAccount() {
  const dataVersion = useBudgetVersion();
  const { accountId } = useParams();
  const [transferMode, setTransferMode] = useState(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const allAccounts = useMemo(() => getAccounts(), [dataVersion]);
  const account = allAccounts.find((entry) => entry.id === accountId);
  if (account === undefined) {
    return <NotFound />;
  }
  const rate = getAccountRate(account);
  const interest = getInterest(account);
  const formatInterest = formatBalance(interest);
  const ceiling = getAccountCeiling(account);
  const formatCeiling = ceiling && formatBalance(ceiling);
  const balance = getAccountBalance(account);
  const balanceFormat = formatBalance(balance);

  function handleTransfer({ label, amount }) {
    const autoLabel =
      transferMode === "deposit"
        ? `Versement vers ${account.name}`
        : `Retrait depuis ${account.name}`;
    const finalLabel = label.trim() === "" ? autoLabel : label;
    const newOperation = {
      id: crypto.randomUUID(),
      ruleId: null,
      label: finalLabel,
      value: transferMode === "deposit" ? -amount : +amount,
      type: transferMode === "deposit" ? "expense" : "income",
      origin: "manual",
      accountId: account.id,
    };
    const currentMonth = getCurrentMonth();
    const currentOperations = getOperations(currentMonth);
    const updatedManualOperations = [...currentOperations, newOperation];
    setOperations(currentMonth, updatedManualOperations);
    setTransferMode(null);
  }
  return (
    <div className={style.page}>
      <h2 className={style.title}>
        {account.name} | | Page du compte (en construction)
      </h2>
      <section className={style.main}>
        <div className={style.actions}>
          <button
            type="button"
            className={`${style.actionBtn} ${style.secondary}`}
            onClick={() => setTransferMode("deposit")}
          >
            <FaArrowDown />
            Versement
          </button>
          <button
            type="button"
            className={`${style.actionBtn} ${style.secondary}`}
            onClick={() => setTransferMode("withdraw")}
          >
            <FaArrowUp />
            Retrait
          </button>
        </div>
      </section>

      <aside className={style.infoPanel} aria-label="Informations du compte">
        <dl className={style.infoList}>
          {rate !== null && (
            <div className={style.infoRow}>
              <dt>Taux</dt>
              <dd>{rate} %</dd>
            </div>
          )}
          {interest !== null && (
            <div className={style.infoRow}>
              <dt>Intérêts estimés / an</dt>
              <dd>≈ {formatInterest}</dd>
            </div>
          )}
          {ceiling && (
            <div className={style.infoRow}>
              <dt>Plafond</dt>
              <dd>{formatCeiling}</dd>
            </div>
          )}
          <div className={style.infoRow}>
            <dt>Solde</dt>
            <dd>{balanceFormat}</dd>
          </div>
        </dl>
      </aside>
      {transferMode !== null && (
        <TransferModal
          accountName={account.name}
          balance={balance}
          ceiling={ceiling}
          mode={transferMode}
          onSubmit={handleTransfer}
          onClose={() => setTransferMode(null)}
        />
      )}
    </div>
  );
}

export default SavingsAccount;
