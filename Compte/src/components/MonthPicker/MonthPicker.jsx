import style from "./MonthPicker.module.css";
import { MONTHS } from "../../constants/months";
import { getYearsOption } from "../../utils/dates";

function MonthPicker({ value, onChange }) {
  const dateSplit = value.split("-");
  const yearNumber = Number(dateSplit[0]);
  const monthNumber = Number(dateSplit[1]);
  const year = getYearsOption();

  return (
    <div>
      <select
        value={monthNumber}
        onChange={(e) => {
          const paddedMonth = e.target.value.padStart(2, "0");
          onChange(`${yearNumber}-${paddedMonth}`);
        }}
      >
        {MONTHS.map((name, index) => (
          <option key={index} value={index + 1}>
            {name}
          </option>
        ))}
      </select>

      <select
        value={yearNumber}
        onChange={(e) => {
          const paddedMonth = monthNumber.toString().padStart(2, "0");
          const newYear = e.target.value;
          onChange(`${newYear}-${paddedMonth}`);
        }}
      >
        {year.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
}

export default MonthPicker;
