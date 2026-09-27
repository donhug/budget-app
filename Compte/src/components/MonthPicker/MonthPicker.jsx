import style from "./MonthPicker.module.css";
import { MONTHS } from "../../constants/months";
import { getYearsOption, parseMonthKey, toMonthKey } from "../../utils/dates";

function MonthPicker({ value, onChange }) {
  const {year, month} = parseMonthKey(value)
  const yearList = getYearsOption();

  return (
    <div>
      <select
        value={month}
        onChange={(e) => {
          const date = toMonthKey(year, e.target.value)
          onChange(date);
        }}
      >
        {MONTHS.map((name, index) => (
          <option key={index} value={index + 1}>
            {name}
          </option>
        ))}
      </select>

      <select
        value={year}
        onChange={(e) => {
          const date = toMonthKey(e.target.value, month)
          onChange(date);
        }}
      >
        {yearList.map((yearOption) => (
          <option key={yearOption} value={yearOption}>
            {yearOption}
          </option>
        ))}
      </select>
    </div>
  );
}

export default MonthPicker;
