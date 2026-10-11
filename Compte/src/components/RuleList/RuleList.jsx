import style from "./RuleList.module.css";
import { formatMonth } from "../../utils/dates";
import { formatBalance } from "../../utils/format";
import {FaPenToSquare, FaTrashCan} from "react-icons/fa6"

function RuleList({ title, rules, onEdit, onDelete }) {
  return (
    <div className={style.list}>
      {title && <h4 className={style.title}>{title}</h4>}

      {rules.length === 0 ? (
        <p className={style.noRule}>Aucune règle</p>
      ) : (
        rules.map((rule) => (
          <div
            key={rule.id}
            className={`${style.item} ${rule.type === "expense" ? style.itemExpense : style.itemIncome}`}
          >
            <div className={style.mainRow}>
              <p className={style.label}>{rule.label}</p>
              <p
                className={`${style.amount} ${rule.type === "expense" ? style.expense : style.income}`}
              >
                {rule.type === "income" ? "+" : ""}
                {formatBalance(rule.value)}
              </p>
            </div>
            <div className={style.datesRow}>
              <span>Début de la règle : {formatMonth(rule.start)}</span>
              <span>
                {" "}
                fin : {rule.end !== null ? formatMonth(rule.end) : "pas de fin"}
              </span>
            </div>
            {onEdit && (
              <div className={style.actions}>
                <button
                  type="button"
                  onClick={() => onEdit(rule)}
                  className={style.editBtn}
                >
                  <FaPenToSquare/>Modifier
                </button>

                <button
                  type="button"
                  onClick={() => onDelete(rule)}
                  className={style.deleteBtn}
                  aria-label="Supprimer la règle"
                >
                  <FaTrashCan/>
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default RuleList;
