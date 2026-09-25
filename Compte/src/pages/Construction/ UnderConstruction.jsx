import style from "./UnderConstruction.module.css";
import WORK from "../../assets/inProgress.png";

function UnderConstruction(props) {
  return (
    <div className={style.main}>
      <div className={style.shell}>
        <h2 className={style.title}>{props.title} - Bientôt disponible</h2>
        <img className={style.img} src={WORK} alt="en cours de construction" />
      </div>
    </div>
  );
}
export default UnderConstruction;
