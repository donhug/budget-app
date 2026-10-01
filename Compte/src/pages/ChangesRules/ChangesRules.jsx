import { useEffect, useState } from "react";
import style from "./ChangesRules.module.css";
import { getRules } from "../../services/storage";
import { getCurrentMonth } from "../../utils/dates";
import RuleList from "../../components/RuleList/RuleList";

function ChangesRules() {
  const [globalRules, setGlobalRules] = useState([]);
  const currentMonth = getCurrentMonth();

  const currentRules = globalRules.filter(
    (rule) =>
      currentMonth >= rule.start &&
      (rule.end === null || currentMonth <= rule.end),
  );
  const futureRules = globalRules.filter((rule) => rule.start > currentMonth);
  const terminatedRules = globalRules.filter(
    (rule) => rule.end !== null && rule.end < currentMonth,
  );

  useEffect(() => {
    setGlobalRules(getRules());
  }, []);

  return (
    <div>
      <h2>Modifications</h2>
      
      <RuleList title="mois en cours" rules={currentRules} />

      <RuleList title="à venir" rules={futureRules} />

      <RuleList title="Règles terminées " rules={terminatedRules} />
      
    </div>
  );
}
export default ChangesRules;
