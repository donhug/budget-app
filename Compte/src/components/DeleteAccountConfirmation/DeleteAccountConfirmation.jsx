import style from "./DeleteAccountConfirmation.module.css";

function DeleteAccountConfirmation({ onDeleteAccount, onCancel, names }) {
  return (
    <div className={style.overlay}>
      <div className={style.modal}>
        <p className={style.message}>Supprimer les comptes suivants ?</p>
        <p className={style.info}>
          Les versements et retraits déjà effectués restent dans votre budget.
        </p>
        <p>{names}</p>
        <div className={style.actions}>
          <button
            className={style.dangerBtn}
            type="button"
            onClick={onDeleteAccount}
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
export default DeleteAccountConfirmation;
