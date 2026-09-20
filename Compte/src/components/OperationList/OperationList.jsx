import style from "./OperationList.module.css";

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
          <p className={style.label}>{op.label}</p>
          <p
            className={`${style.amount} ${
              op.type === "expense" ? style.expense : style.income
            }`}
          >
            {op.type === "income" ? "+" : ""}
            {op.value}€{" "}
          </p>
          <button
            type="button"
            onClick={() => onDelete(op)}
            className={style.deleteBtn}
          >
            {" "}
            supprimer l'operation
          </button>
        </div>
      ))}
      <h3 className={style.total}>total:{total}€</h3>
    </div>
  );
}
export default OperationList;
