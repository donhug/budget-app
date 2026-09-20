import style from "./DeleteConfirmation.module.css";
function DeleteConfirmation({
  label,
  onDeleteOperation,
  onDeleteRule,
  onCancel,
}) {
  return (
    <div className={style.overlay}>
      <div className={style.modal}>
        <p className={style.message}>supprimer : "{label}"?</p>
        <div className={style.actions}>
          <button
            className={style.optionBtn}
            type="button"
            onClick={onDeleteOperation}
          >
            Juste ce mois-ci
          </button>
          <button
            className={style.dangerBtn}
            type="button"
            onClick={onDeleteRule}
          >
            Supprimer la règle
          </button>
          <button className={style.cancelBtn} type="button" onClick={onCancel}>
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}
export default DeleteConfirmation;
