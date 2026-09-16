function DeleteConfirmation({
  label,
  onDeleteOperation,
  onDeleteRule,
  onCancel,
}) {
  return (
    <div>
      <p>supprimer "{label}"?</p>
      <button type="button" onClick={onDeleteOperation}>
        Juste ce mois-ci
      </button>
      <button type="button" onClick={onDeleteRule}>
        Supprimer la règle
      </button>
      <button type="button" onClick={onCancel}>
        Annuler
      </button>
    </div>
  );
}
export default DeleteConfirmation;
