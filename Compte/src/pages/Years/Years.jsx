import style from "./Years.module.css";
import { MONTHS } from "../../constants/months";
import { toMonthKey } from "../../utils/dates";
function Years() {
  const year = new Date().getFullYear();
  return (
    <>
      <div>
        <h2>Année</h2>
        {MONTHS.map((month, index) => (
          <p key={month}>
            {month}--
            {toMonthKey(year, index + 1)}
          </p>
        ))}
      </div>
    </>
  );
}

export default Years;
