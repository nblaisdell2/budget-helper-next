import { useEffect, useState } from "react";
import {
  calculateUpcomingExpenses,
  calculateUpcomingExpensesForCategory,
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
  console.log(userCategoryList);

  useEffect(() => {
    let newUpcomingExpenses = calculateUpcomingExpenses(
      userCategoryList,
      dayOfWeek,
      dayOfMonth,
      userDetails.PayFrequency
    );
    setUpcoming(newUpcomingExpenses);
  }, [dayOfWeek, dayOfMonth]);

  return (
    <div>
      <div className="flex justify-evenly">
        <div className="text-center font-bold text-3xl underline">
          Upcoming Expenses
        </div>
        <div>
          {userDetails.PayFrequency &&
            (((userDetails.PayFrequency == "Every Week" ||
              userDetails.PayFrequency == "Every 2 Weeks") && (
              <div>
                <div className="flex flex-col">
                  <div className="uppercase underline text-lg font-semibold">
                    Day of the Week
                  </div>
                  <div className="flex">
                    <div className="mr-5" onClick={() => setDayOfWeek("Sun")}>
                      <input
                        type="radio"
                        checked={(dayOfWeek && dayOfWeek == "Sun") || false}
                        onChange={() => {}}
                      />
                      <label className="ml-1 hover:cursor-pointer">Sun</label>
                    </div>
                    <div className="mr-5" onClick={() => setDayOfWeek("Mon")}>
                      <input
                        type="radio"
                        checked={(dayOfWeek && dayOfWeek == "Mon") || false}
                        onChange={() => {}}
                      />
                      <label className="ml-1 hover:cursor-pointer">Mon</label>
                    </div>
                    <div className="mr-5" onClick={() => setDayOfWeek("Tue")}>
                      <input
                        type="radio"
                        checked={(dayOfWeek && dayOfWeek == "Tue") || false}
                        onChange={() => {}}
                      />
                      <label className="ml-1 hover:cursor-pointer">Tue</label>
                    </div>
                    <div className="mr-5" onClick={() => setDayOfWeek("Wed")}>
                      <input
                        type="radio"
                        checked={(dayOfWeek && dayOfWeek == "Wed") || false}
                        onChange={() => {}}
                      />
                      <label className="ml-1 hover:cursor-pointer">Wed</label>
                    </div>
                    <div className="mr-5" onClick={() => setDayOfWeek("Thu")}>
                      <input
                        type="radio"
                        checked={(dayOfWeek && dayOfWeek == "Thu") || false}
                        onChange={() => {}}
                      />
                      <label className="ml-1 hover:cursor-pointer">Thu</label>
                    </div>
                    <div className="mr-5" onClick={() => setDayOfWeek("Fri")}>
                      <input
                        type="radio"
                        checked={(dayOfWeek && dayOfWeek == "Fri") || false}
                        onChange={() => {}}
                      />
                      <label className="ml-1 hover:cursor-pointer">Fri</label>
                    </div>
                    <div className="mr-5" onClick={() => setDayOfWeek("Sat")}>
                      <input
                        type="radio"
                        checked={(dayOfWeek && dayOfWeek == "Sat") || false}
                        onChange={() => {}}
                      />
                      <label className="ml-1 hover:cursor-pointer">Sat</label>
                    </div>
                  </div>
                </div>
              </div>
            )) ||
              (userDetails.PayFrequency == "Monthly" && (
                <div className="flex flex-col">
                  <div className="uppercase underline text-lg font-semibold">
                    Day of Month
                  </div>
                  <select
                    className="border border-black"
                    value={dayOfMonth}
                    onChange={(e) => setDayOfMonth(e.target.value)}
                  >
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                    <option value={5}>5</option>
                    <option value={6}>6</option>
                    <option value={7}>7</option>
                    <option value={8}>8</option>
                    <option value={9}>9</option>
                    <option value={10}>10</option>
                    <option value={11}>11</option>
                    <option value={12}>12</option>
                    <option value={13}>13</option>
                    <option value={14}>14</option>
                    <option value={15}>15</option>
                    <option value={16}>16</option>
                    <option value={17}>17</option>
                    <option value={18}>18</option>
                    <option value={19}>19</option>
                    <option value={20}>20</option>
                    <option value={21}>21</option>
                    <option value={22}>22</option>
                    <option value={23}>23</option>
                    <option value={24}>24</option>
                    <option value={25}>25</option>
                    <option value={26}>26</option>
                    <option value={27}>27</option>
                    <option value={28}>28</option>
                    <option value={29}>29</option>
                    <option value={30}>30</option>
                    <option value={31}>31</option>
                  </select>
                </div>
              )))}
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
