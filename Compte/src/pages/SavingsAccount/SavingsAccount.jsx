import style from "./SavingsAccount.module.css";
import { useParams } from "react-router";
import NotFound from "../NotFound/NotFound";
import { getAccounts } from "../../services/storage";

function SavingsAccount() {
  const { accountId } = useParams();
  const allAccounts = getAccounts();
  const account = allAccounts.find((entry) => entry.id === accountId);

  if (account === undefined) {
    return <NotFound />;
  }
  return (
    <div>
      <h2>{account.name}</h2>
      <p>Page du compte (en construction)</p>
    </div>
  );
}

export default SavingsAccount;
