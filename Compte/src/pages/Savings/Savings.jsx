import style from "./Savings.module.css";
import CreateAccountModal from "../../components/CreateAccountModal/CreateAccountModal";
import { useState } from "react";
import { FaPlus } from "react-icons/fa6";

function Savings() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className={style.page}>
      <h2 className={style.title}>Épargnes</h2>
      <div className={style.grid}>
        <button
          type="button"
          className={style.addTile}
          onClick={() => setIsModalOpen(true)}
        >
          <FaPlus className={style.addIcon} />
          Ajouter un compte ou une épargne
        </button>
      </div>
      {isModalOpen && (
        <CreateAccountModal
          onClose={() => setIsModalOpen(false)}
          onSubmit={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}

export default Savings;
