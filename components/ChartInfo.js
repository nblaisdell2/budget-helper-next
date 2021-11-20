import BudgetChartInfo from "./BudgetChartInfo";
import SixMonthInfo from "./SixMonthInfo";
import UpcomingExpensesInfo from "./UpcomingExpensesInfo";

function ChartInfo({
  type,
  categories,
  sixMonthDetails,
  setUserCategories,
  userCategoryList,
  setUserCategoryList,
  userDetails,
  setUserDetails,
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
            setUserDetails={setUserDetails}
          />
        );
      case "Six Month Details":
        return <SixMonthInfo sixMonthDetails={sixMonthDetails} />;
      case "Upcoming Expenses":
        return <UpcomingExpensesInfo />;
      default:
        return <div>No Data</div>;
    }
  };

  return (
    <div className="w-2/5 border-2 border-gray-400 p-5 rounded-3xl ml-3 shadow-2xl h-[640px] ">
      {renderChartInfo(type, categories)}
    </div>
  );
}

export default ChartInfo;
