import style from "./DeletePastConfirmation.module.css";

function DeletePastConfirmation({ label, onCancel, onDeleteOperation }) {
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
            Supprimer
          </button>

          <button className={style.cancelBtn} type="button" onClick={onCancel}>
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}
export default DeletePastConfirmation;
