import BudgetChartInfo from "./BudgetChartInfo";
import SixMonthInfo from "./SixMonthInfo";
import UpcomingExpensesInfo from "./UpcomingExpensesInfo";

function ChartInfo({ type }) {
  const renderChartInfo = (type) => {
    switch (type) {
      case "Budget Chart":
        return <BudgetChartInfo />;
      case "Six Month Details":
        return <SixMonthInfo />;
      case "Upcoming Expenses":
        return <UpcomingExpensesInfo />;
      default:
        return <div>No Data</div>;
    }
  };
  return <div className="w-1/3 bg-gray-500 p-5">{renderChartInfo(type)}</div>;
}

export default ChartInfo;
