import style from "./DeletePastConfirmation.module.css";

function DeletePastConfirmation({ label, onCancel, onDeleteOperation }) {
  return (
    <div className={style.overlay}>
      <div className={style.modal}>
        <p className={style.message}>Supprimer « {label} » ?</p>
        <p className={style.info}>
          Les soldes de ce mois, des mois suivants et du mois en cours seront
          mis à jour.
        </p>
        <div className={style.actions}>
          <button
            className={style.dangerBtn}
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
