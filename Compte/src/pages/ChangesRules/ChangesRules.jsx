import { useEffect, useState } from "react";
import style from "./ChangesRules.module.css";
import { getRules } from "../../services/storage";
import OperationList from "../../components/OperationList/OperationList";

function ChangesRules() {
  const [globalRules, setGlobalRules] = useState([]);

  useEffect(() => {
    setGlobalRules(getRules());
  }, []);

  return (
    <div>
      <h2>Modifications</h2>
      {globalRules.map((rule) => (
        <div>
          <p>
            {rule.label} --- {rule.type} --- {rule.value}
          </p>
        </div>
      ))}
    </div>
  );
}
export default ChangesRules;
