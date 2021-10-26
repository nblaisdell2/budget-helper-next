import BudgetChart from "./BudgetChart";
import SixMonthChart from "./SixMonthChart";
import UpcomingExpenses from "./UpcomingExpenses";

function ChartSection({ type }) {
  const renderChartDetails = (type) => {
    switch (type) {
      case "Budget Chart":
        return <BudgetChart />;
      case "Six Month Details":
        return <SixMonthChart />;
      case "Upcoming Expenses":
        return <UpcomingExpenses />;
    }
  };
  return (
    <div className="w-2/3 bg-gray-400 p-5">{renderChartDetails(type)}</div>
  );
}

export default ChartSection;
