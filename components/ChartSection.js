import BudgetChart from "./BudgetChart";
import SixMonthChart from "./SixMonthChart";
import UpcomingExpenses from "./UpcomingExpenses";
import { useUser } from "@auth0/nextjs-auth0";

function ChartSection({
  type,
  categories,
  sixMonthDetails,
  userDetails,
  setUserDetails,
  userCategoryList,
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
          />
        );
      case "Six Month Details":
        return <SixMonthChart sixMonthDetails={sixMonthDetails} />;
      case "Upcoming Expenses":
        return <UpcomingExpenses />;
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
