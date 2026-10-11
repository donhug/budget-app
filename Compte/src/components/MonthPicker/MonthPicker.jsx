import style from "./MonthPicker.module.css";
import { MONTHS } from "../../constants/months";
import { getYearsOption, parseMonthKey, toMonthKey } from "../../utils/dates";
import { FaChevronDown } from "react-icons/fa6";

function MonthPicker({ value, onChange }) {
  const { year, month } = parseMonthKey(value);
  const yearList = getYearsOption();

  return (
    <div className={style.picker}>
      <div className={style.selectWrapper}>
        <select
          className={style.select}
          aria-label="Mois"
          value={month}
          onChange={(e) => {
            const date = toMonthKey(year, e.target.value);
            onChange(date);
          }}
        >
          {MONTHS.map((name, index) => (
            <option key={index} value={index + 1}>
              {name}
            </option>
          ))}
        </select>
        <FaChevronDown className={style.chevron} />
      </div>

      <div className={style.selectWrapper}>
        <select
          aria-label="Année"
          className={style.select}
          value={year}
          onChange={(e) => {
            const date = toMonthKey(e.target.value, month);
            onChange(date);
          }}
        >
          {yearList.map((yearOption) => (
            <option key={yearOption} value={yearOption}>
              {yearOption}
            </option>
          ))}
        </select>
        <FaChevronDown className={style.chevron} />
      </div>
    </div>
  );
}

export default MonthPicker;
