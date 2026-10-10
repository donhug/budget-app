import style from "./OperationList.module.css";
import { formatBalance } from "../../utils/format";
import { FaTrashCan } from "react-icons/fa6";
function OperationList({ title, operations, total, onDelete }) {
  return (
    <div className={style.list}>
      <h2 className={style.title}>{title}</h2>
      {operations.map((op) => (
        <div
          key={op.id}
          className={`${style.item} ${
            op.type === "expense" ? style.itemExpense : style.itemIncome
          }`}
        >
          <div className={style.mainRow}>
            <p className={style.label}>{op.label}</p>
            <p
              className={`${style.amount} ${
                op.type === "expense" ? style.expense : style.income
              }`}
            >
              {op.type === "income" ? "+" : ""}
              {formatBalance(op.value)}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onDelete(op)}
            className={style.deleteBtn}
            aria-label="Supprimmer l'opération"
          >
            <FaTrashCan/>
          </button>
        </div>
      ))}
      <h3 className={style.total}>Total :{formatBalance(total)}</h3>
    </div>
  );
}
export default OperationList;
