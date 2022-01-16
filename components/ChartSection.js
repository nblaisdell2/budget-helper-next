import BudgetChart from "./BudgetChart";
import SixMonthChart from "./SixMonthChart";
import UpcomingExpensesChart from "./UpcomingExpensesChart";
import { useUser } from "@auth0/nextjs-auth0";

function ChartSection({
  type,
  categories,
  sixMonthDetails,
  userDetails,
  setUserDetails,
  userCategoryList,
  setUserCategoryList,
  setUpcomingExpensesInfo,
  upExpenseInd,
  dayOfWeek,
  setDayOfWeek,
  dayOfMonth,
  setDayOfMonth,
  upcoming,
  setUpcoming,
}) {
  const { user, isLoading } = useUser();

  const renderChartDetails = (type) => {
    switch (type) {
      case "Budget Chart":
        return (
          <BudgetChart
            userDetails={userDetails}
            setUserDetails={setUserDetails}
            userCategoryList={userCategoryList}
            setUserCategoryList={setUserCategoryList}
          />
        );
      case "Six Month Details":
        return <SixMonthChart sixMonthDetails={sixMonthDetails} />;
      case "Upcoming Expenses":
        return (
          <UpcomingExpensesChart
            userDetails={userDetails}
            userCategoryList={userCategoryList}
            setUpcomingExpensesInfo={setUpcomingExpensesInfo}
            upExpenseInd={upExpenseInd}
            dayOfWeek={dayOfWeek}
            setDayOfWeek={setDayOfWeek}
            dayOfMonth={dayOfMonth}
            setDayOfMonth={setDayOfMonth}
            upcoming={upcoming}
            setUpcoming={setUpcoming}
          />
        );
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-3/5 border-2 border-gray-400 p-5 rounded-3xl mr-3 shadow-2xl h-[640px]">
      {renderChartDetails(type)}
    </div>
  );
}

export default ChartSection;
