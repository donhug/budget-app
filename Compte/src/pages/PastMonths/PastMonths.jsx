import style from "./PastMonths.module.css";
import { useParams } from "react-router";
import { formatMonth } from "../../utils/dates";
function PastMonths() {
  const { monthKey } = useParams();
  const Month = formatMonth(monthKey);
  return (
    <>
      <h2>{Month}</h2>
    </>
  );
}
export default PastMonths;
