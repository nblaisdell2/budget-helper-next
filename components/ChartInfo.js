import BudgetChartInfo from "./BudgetChartInfo";
import SixMonthInfo from "./SixMonthInfo";
import UpcomingExpensesInfo from "./UpcomingExpensesInfo";

function ChartInfo({
  type,
  categories,
  setUserCategories,
  userCategoryList,
  setUserCategoryList,
  userDetails,
}) {
  const renderChartInfo = (type) => {
    switch (type) {
      case "Budget Chart":
        return (
          <BudgetChartInfo
            categories={categories}
            setUserCategories={setUserCategories}
            userCategoryList={userCategoryList}
            setUserCategoryList={setUserCategoryList}
            userDetails={userDetails}
          />
        );
      case "Six Month Details":
        return <SixMonthInfo />;
      case "Upcoming Expenses":
        return <UpcomingExpensesInfo />;
      default:
        return <div>No Data</div>;
    }
  };

  return (
    <div className="w-1/3 border-2 border-gray-400 p-5 rounded-3xl ml-3 shadow-2xl h-[640px] ">
      {renderChartInfo(type, categories)}
    </div>
  );
}

export default ChartInfo;
