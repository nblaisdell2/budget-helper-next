import BudgetChartInfo from "./BudgetChartInfo";
import SixMonthInfo from "./SixMonthInfo";
import UpcomingExpensesInfo from "./UpcomingExpensesInfo";

function ChartInfo({
  type,
  sixMonthDetails,
  setSixMonthDetails,
  categories,
  setUserCategories,
  userCategoryList,
  setUserCategoryList,
  userDetails,
  setUserDetails,
  nextAutoRuns,
  setNextAutoRuns,
  upExpenseInd,
  dayOfWeek,
  setDayOfWeek,
  dayOfMonth,
  setDayOfMonth,
  upcoming,
  setUpcoming,
  setUpcomingExpensesInfo,
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
            nextAutoRuns={nextAutoRuns}
            setNextAutoRuns={setNextAutoRuns}
          />
        );
      case "Six Month Details":
        return (
          <SixMonthInfo
            userDetails={userDetails}
            setUserDetails={setUserDetails}
            sixMonthDetails={sixMonthDetails}
            setSixMonthDetails={setSixMonthDetails}
          />
        );
      case "Upcoming Expenses":
        return (
          <UpcomingExpensesInfo
            userDetails={userDetails}
            upExpenseInd={upExpenseInd}
            userCategoryList={userCategoryList}
            dayOfWeek={dayOfWeek}
            setDayOfWeek={setDayOfWeek}
            dayOfMonth={dayOfMonth}
            setDayOfMonth={setDayOfMonth}
            upcoming={upcoming}
            setUpcoming={setUpcoming}
            setUpcomingExpensesInfo={setUpcomingExpensesInfo}
          />
        );
      default:
        return <div>No Data</div>;
    }
  };

  return (
    <div className="w-2/5 border-2 border-gray-400 p-5 rounded-3xl ml-3 mr-6 shadow-2xl h-[720px] bg-white">
      {renderChartInfo(type, categories)}
    </div>
  );
}

export default ChartInfo;
