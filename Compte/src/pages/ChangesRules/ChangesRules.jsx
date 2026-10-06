import { useEffect, useState } from "react";
import style from "./ChangesRules.module.css";
import { getRules } from "../../services/storage";
import { formatMonth, getCurrentMonth } from "../../utils/dates";
import { groupRulesByStartMonth } from "../../services/budget";
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
  const futureRulesByMonth = groupRulesByStartMonth(futureRules);
  const sortFutureMonth = Object.keys(futureRulesByMonth).sort();
  const terminatedRules = globalRules.filter(
    (rule) => rule.end !== null && rule.end < currentMonth,
  );

  useEffect(() => {
    setGlobalRules(getRules());
  }, []);

  return (
    <div>
      <h2>Modifications</h2>
      <h3>Mois en cours</h3>
      <RuleList title={formatMonth(currentMonth)} rules={currentRules} />
      <h3>À venir</h3>
      {futureRules.length === 0 ? (
        <p>Aucune règle à venir</p>
      ) : (
        sortFutureMonth.map((month) => (
          <RuleList
            key={month}
            title={formatMonth(month)}
            rules={futureRulesByMonth[month]}
          />
        ))
      )}
      <h3>Règles terminées</h3>
      <RuleList rules={terminatedRules} />
    </div>
  );
}
export default ChangesRules;
