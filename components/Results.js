import ChartInfo from "./ChartInfo";
import ChartSection from "./ChartSection";
import { useUser } from "@auth0/nextjs-auth0";
import { useEffect, useState } from "react";
import {
  calculateUpcomingExpensesForCategory,
  getAllCategories,
} from "../utils";

function Results({
  name,
  changeWidget,
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
}) {
  const { isLoading } = useUser();

  const [dayOfWeek, setDayOfWeek] = useState("Thu");
  const [dayOfMonth, setDayOfMonth] = useState(1);
  const [upcoming, setUpcoming] = useState([]);
  const [upExpenseInd, setUpExpenseInd] = useState({});

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const setUpcomingExpensesInfo = (upcomingExpense) => {
    setUpExpenseInd(upcomingExpense);
  };

  useEffect(() => {
    if (upExpenseInd && Object.keys(upExpenseInd).length > 0) {
      let catDetails = getAllCategories(userCategoryList).find(
        (x) =>
          x.id == upExpenseInd.ItemID &&
          x.categoryGroupID == upExpenseInd.ItemGroupID
      );

      setUpExpenseInd(
        calculateUpcomingExpensesForCategory(
          catDetails,
          dayOfWeek,
          dayOfMonth,
          userDetails.PayFrequency,
          0
        )
      );
    }
  }, [dayOfWeek, dayOfMonth]);

  return (
    <div>
      <div className="flex min-h-full max-h-[650px]">
        <ChartSection
          type={name}
          sixMonthDetails={sixMonthDetails}
          setSixMonthDetails={setSixMonthDetails}
          categories={categories}
          userDetails={userDetails}
          setUserDetails={setUserDetails}
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
        <ChartInfo
          type={name}
          sixMonthDetails={sixMonthDetails}
          setSixMonthDetails={setSixMonthDetails}
          categories={categories}
          setUserCategories={setUserCategories}
          userCategoryList={userCategoryList}
          setUserCategoryList={setUserCategoryList}
          userDetails={userDetails}
          setUserDetails={setUserDetails}
          nextAutoRuns={nextAutoRuns}
          setNextAutoRuns={setNextAutoRuns}
          upExpenseInd={upExpenseInd}
          dayOfWeek={dayOfWeek}
          setDayOfWeek={setDayOfWeek}
          dayOfMonth={dayOfMonth}
          setDayOfMonth={setDayOfMonth}
          upcoming={upcoming}
          setUpcoming={setUpcoming}
        />
      </div>
    </div>
  );
}

export default Results;
