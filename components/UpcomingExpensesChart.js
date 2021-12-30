import { useEffect, useState } from "react";
import { daysBetween, getAmountByFrequency, getLatestBalance } from "../utils";

function UpcomingExpensesChart({ userDetails, userCategoryList }) {
  const [dayOfWeek, setDayOfWeek] = useState("Thu");
  const [dayOfMonth, setDayOfMonth] = useState(1);

  const [upcoming, setUpcoming] = useState([]);

  const merge = (obj, fieldName) => {
    let subArrays = obj.map((x) => x[fieldName]);
    return subArrays.reduce((a, b) => {
      return a.concat(b);
    }, []);
  };

  const recalculateUpcomingExpenses = () => {
    let upcomingTemp = [];
    let potential = merge(userCategoryList, "categories").filter(
      (x) => x.upcomingExpense !== null && x.categoryAmount > 0
    );

    for (let i = 0; i < potential.length; i++) {
      let ynabLatestBalance = getLatestBalance(potential[i].id);
      console.log("YNAB - Latest balance for " + potential[i].name);
      console.log(ynabLatestBalance);

      let dtWithTime = new Date();
      dtWithTime.setHours(0, 0, 0, 0);

      if (
        userDetails.PayFrequency == "Every Week" ||
        userDetails.PayFrequency == "Every 2 Weeks"
      ) {
        let weekNum = 0;
        switch (dayOfWeek) {
          case "Sun":
            weekNum = 0;
            break;
          case "Mon":
            weekNum = 1;
            break;
          case "Tue":
            weekNum = 2;
            break;
          case "Wed":
            weekNum = 3;
            break;
          case "Thu":
            weekNum = 4;
            break;
          case "Fri":
            weekNum = 5;
            break;
          case "Sat":
            weekNum = 6;
            break;
          default:
            break;
        }

        let daysToAdd = weekNum - dtWithTime.getDay();
        if (daysToAdd < 0) {
          daysToAdd += 7;
        } else if (daysToAdd == 0 && dtWithTime < new Date()) {
          daysToAdd += 7;
        }

        dtWithTime = new Date(
          dtWithTime.setDate(dtWithTime.getDate() + daysToAdd)
        );
      } else if (userDetails.PayFrequency == "Monthly") {
        let dtTemp = new Date();
        if (dtTemp.getDate() > dayOfMonth) {
          dtTemp = new Date(dtTemp.setMonth(dtTemp.getMonth() + 1));
          dtTemp = new Date(dtTemp.setDate(dayOfMonth));
        } else {
          dtTemp = new Date(dtTemp.setDate(dayOfMonth));
        }
        dtWithTime = dtTemp;
        dtWithTime.setHours(0, 0, 0, 0);
      }

      let totalPurchaseAmt = potential[i].upcomingExpense - ynabLatestBalance;
      let amtPerPaycheck = getAmountByFrequency(
        potential[i].categoryAmount,
        userDetails.PayFrequency
      );

      let newAutoRunList = [];
      do {
        totalPurchaseAmt -= amtPerPaycheck;

        newAutoRunList.push({
          RunTime: dtWithTime.toISOString(),
          Frequency: userDetails.PayFrequency,
          AmtPerPaycheck: amtPerPaycheck,
          TotalAmt: totalPurchaseAmt,
        });

        let dtTemp = new Date(dtWithTime);
        switch (userDetails.PayFrequency) {
          case "Every Week":
            dtTemp = new Date(dtTemp.setDate(dtTemp.getDate() + 7));
            break;
          case "Every 2 Weeks":
            dtTemp = new Date(dtTemp.setDate(dtTemp.getDate() + 14));
            break;
          case "Monthly":
            dtTemp = new Date(dtTemp.setMonth(dtTemp.getMonth() + 1));
            break;
          default:
            break;
        }

        dtWithTime = dtTemp;
      } while (totalPurchaseAmt > 0);

      console.log("Auto run list for paying off expense");
      console.log(newAutoRunList);

      let dtPurchaseDate = new Date(
        newAutoRunList[newAutoRunList.length - 1].RunTime
      );
      let numPaychecks = newAutoRunList.length;
      let numDaysToPurchase = daysBetween(new Date(), dtPurchaseDate);
      upcomingTemp.push({
        ItemName: potential[i].name,
        ItemAmount:
          "$" +
          ynabLatestBalance.toFixed(0) +
          " / $" +
          potential[i].upcomingExpense.toFixed(0),
        ItemDate: new Date(
          newAutoRunList[newAutoRunList.length - 1].RunTime
        ).toLocaleDateString("en-US"),
        NumDays: numDaysToPurchase.toFixed(0),
        NumPaychecks: numPaychecks,
      });
    }

    console.log("upcoming expenses - BEFORE?");
    console.log(upcomingTemp);

    upcomingTemp.sort((a, b) =>
      parseInt(a.NumDays) > parseInt(b.NumDays) ? 1 : -1
    );

    console.log("upcoming expenses - sorted?");
    console.log(upcomingTemp);

    setUpcoming(upcomingTemp);
  };

  useEffect(() => {
    recalculateUpcomingExpenses();
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
              return (
                <tr key={i} className="hover:bg-gray-200">
                  <td>{v.ItemName}</td>
                  <td className="text-right">{v.ItemAmount}</td>
                  <td className="text-right">{v.ItemDate}</td>
                  <td className="text-right">{v.NumDays}</td>
                  <td className="text-right">
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
