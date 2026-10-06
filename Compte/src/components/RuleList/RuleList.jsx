import style from "./RuleList.module.css";
import { formatMonth } from "../../utils/dates";

function RuleList({ title, rules, onEdit }) {
  return (
    <div>
      {title && <h4>{title}</h4>}

      {rules.length === 0 ? (
        <p>Aucune règle</p>
      ) : (
        rules.map((rule) => (
          <div key={rule.id}>
            <div>
              <p>{rule.label}</p>
              <p>
                {rule.type === "income" ? "+" : ""}
                {rule.value}€{" "}
              </p>
            </div>
            <div>
              <p>Début de la règle : {formatMonth(rule.start)}</p>
              <p>
                {" "}
                fin :{rule.end !== null ? formatMonth(rule.end) : "pas de fin"}
              </p>
            </div>
            {onEdit && (
              <button type="button" onClick={() => onEdit(rule)}>
                Modifier
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default RuleList;
