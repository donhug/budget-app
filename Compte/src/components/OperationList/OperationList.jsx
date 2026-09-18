function OperationList({ title, operations, total, onDelete }) {
  return (
    <div>
      <h2>{title}</h2>
      {operations.map((op) => (
        <div key={op.id}>
          <p>
            {op.label} : {op.value}€
          </p>
          <button type="button" onClick={() => onDelete(op)}>
            {" "}
            supprimer l'operation
          </button>
        </div>
      ))}
      <h3>total:{total}€</h3>
    </div>
  );
}
export default OperationList;
