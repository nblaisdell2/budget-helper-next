import { useEffect, useState } from "react";
import {
  calculateUpcomingExpenses,
  calculateUpcomingExpensesForCategory,
  getShortDate,
  daysBetween,
} from "../utils";

function UpcomingExpensesChart({
  userDetails,
  userCategoryList,
  setUpcomingExpensesInfo,
  upExpenseInd,
  setUpExpenseInd,
  dayOfWeek,
  setDayOfWeek,
  dayOfMonth,
  setDayOfMonth,
  upcoming,
  setUpcoming,
}) {
  useEffect(() => {
    let dayOfWeek = new Date(userDetails.NextPaydate)
      .toLocaleDateString("en-US", { weekday: "long" })
      .substring(0, 3);
    let dayOfMonth = new Date(userDetails.NextPaydate).getDate();
    let newUpcomingExpenses = calculateUpcomingExpenses(
      userCategoryList,
      dayOfWeek,
      dayOfMonth,
      userDetails.PayFrequency
    );
    setUpcoming(newUpcomingExpenses);
  }, [dayOfWeek, dayOfMonth]);

  let dtNext = userDetails.NextPaydate
    ? new Date(userDetails.NextPaydate)
    : new Date();
  let daysBetweenNext = Math.ceil(daysBetween(new Date(), dtNext) - 1);
  if (daysBetweenNext < 0) {
    daysBetweenNext = 0;
  }

  return (
    <div>
      <div className="flex justify-evenly">
        <div className="text-center font-bold text-3xl underline">
          Upcoming Expenses
        </div>
        <div className="text-center">
          <div className="underline font-bold">Next Paydate</div>
          <div className=" text-lg">
            {getShortDate(dtNext) + " (" + daysBetweenNext + " days away)"}
          </div>
        </div>
      </div>

      <hr className="mt-3" />

      <div className="flex flex-col my-4 h-[500px] overflow-y-auto">
        <table className="relative table-auto">
          <thead>
            <tr>
              <th className="sticky top-0 bg-white text-left">Item/Category</th>
              <th className="sticky top-0 bg-white text-right">Total Amount</th>
              <th className="sticky top-0 bg-white text-right">
                Purchase Date
              </th>
              <th className="sticky top-0 bg-white text-right">
                Days Until Purchase
              </th>
              <th className="sticky top-0 bg-white text-right">
                <div className="mr-3"># of Paychecks Until Purchase</div>
              </th>
            </tr>
          </thead>

          <tbody>
            {upcoming.map((v, i) => {
              console.log("LOOK HERE");
              console.log(upExpenseInd);
              console.log(v);
              return (
                <tr
                  key={i}
                  className={`hover:bg-gray-200 ${
                    v.ItemGroupID == upExpenseInd.ItemGroupID &&
                    v.ItemID == upExpenseInd.ItemID
                      ? "bg-gray-300"
                      : ""
                  } hover:cursor-pointer`}
                  onClick={() => {
                    console.log("setting expenses info");
                    console.log(v);
                    console.log(upcoming);
                    setUpcomingExpensesInfo(v);
                  }}
                >
                  <td className="p-1">{v.ItemName}</td>
                  <td className="text-right p-1">{v.ItemAmount}</td>
                  <td className="text-right p-1">{v.ItemDate}</td>
                  <td className="text-right p-1">{v.NumDays}</td>
                  <td className="text-right p-1">
                    <div className="mr-3">{v.NumPaychecks}</div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UpcomingExpensesChart;
