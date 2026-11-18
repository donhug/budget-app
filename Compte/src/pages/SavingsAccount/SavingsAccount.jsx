import style from "./SavingsAccount.module.css";
import { useParams } from "react-router";
import NotFound from "../NotFound/NotFound";
import { getAccounts } from "../../services/storage";
import { useMemo } from "react";
import { getAccountCeiling, getAccountRate } from "../../services/savings";
import { useBudgetVersion } from "../../hooks/useBudgetVersion";
import { formatBalance } from "../../utils/format";

function SavingsAccount() {
  const dataVersion = useBudgetVersion();
  const { accountId } = useParams();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const allAccounts = useMemo(() => getAccounts(), [dataVersion]);
  const account = allAccounts.find((entry) => entry.id === accountId);
  const rate = getAccountRate(account);
  const ceiling = formatBalance(getAccountCeiling(account));

  if (account === undefined) {
    return <NotFound />;
  }
  return (
    <div>
      <h2>{account.name}</h2>
      <p>Page du compte (en construction)</p>
      {rate && <p>{rate} %</p>}
      {ceiling && <p>{ceiling}</p>}
    </div>
  );
}

export default SavingsAccount;
