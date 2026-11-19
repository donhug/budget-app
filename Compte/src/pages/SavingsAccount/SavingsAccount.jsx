import style from "./SavingsAccount.module.css";
import { useParams } from "react-router";
import NotFound from "../NotFound/NotFound";
import { getAccounts } from "../../services/storage";
import { useMemo } from "react";
import {
  getAccountCeiling,
  getAccountRate,
  getInterest,
  getAccountBalance,
} from "../../services/savings";
import { useBudgetVersion } from "../../hooks/useBudgetVersion";
import { formatBalance } from "../../utils/format";
import { FaArrowDown, FaArrowUp } from "react-icons/fa6";
function SavingsAccount() {
  const dataVersion = useBudgetVersion();
  const { accountId } = useParams();
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
  return (
    <div className={style.page}>
      <h2 className={style.title}>
        {account.name} | | Page du compte (en construction)
      </h2>
      <section className={style.main}>
        <div className={style.actions}>
          <button
            type="button"
            className={`${style.actionBtn} ${style.primary}`}
          >
            <FaArrowDown />
            Versement
          </button>
          <button
            type="button"
            className={`${style.actionBtn} ${style.secondary}`}
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
    </div>
  );
}

export default SavingsAccount;
