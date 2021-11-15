import ArrowLeft from "@heroicons/react/outline/ArrowLeftIcon";
import { useEffect, useState } from "react";
import DateTimePicker from "./DateTimePicker";
import getCategoryAmountModified from "../utils.js";

function BudgetCategoryInfo({
  category,
  setCategory,
  monthlyAmount,
  setChangesMade,
}) {
  console.log("passed in category");
  console.log(category);

  console.log("getting category amount modified");
  console.log(getCategoryAmountModified(category));

  const [showUpcoming, setShowUpcoming] = useState(
    category.upcomingExpense !== null
  );
  const [showRegular, setShowRegular] = useState(category.expenseType !== null);

  const [autoDate, setAutoDate] = useState(
    category.expenseDate ? new Date(category.expenseDate) : new Date()
  );

  const [dateChanged, setDateChanged] = useState(false);

  const getNewCategory = (prop, val) => {
    setChangesMade(true);
    let newCategory = { ...category };
    newCategory[prop] = val;
    return newCategory;
  };

  useEffect(() => {
    if (!dateChanged) {
      setDateChanged(true);
    } else {
      let newCat = getNewCategory("expenseDate", autoDate.toISOString());
      setCategory(newCat);
    }
  }, [autoDate]);

  let amountPercent =
    monthlyAmount == 0 ? 0 : (category.categoryAmount / monthlyAmount) * 100;
  return (
    <div>
      <div className="flex justify-between">
        <ArrowLeft
          className="h-8 cursor-pointer"
          onClick={() => {
            setCategory(null);
          }}
        />
      </div>

      <div className="text-center font-bold text-3xl my-2">
        <h2>{category.name}</h2>
      </div>

      <div className="h-[500px] overflow-y-auto">
        <div className="flex justify-evenly rounded-2xl border border-gray-500 bg-gray-200 p-1">
          {/* Category Amount (direct) */}
          <div className="flex flex-col justify-between p-2 pt-1">
            <div className="text-center font">Amount</div>

            <div className="flex-grow">
              <input
                className="text-right p-2 border border-black rounded-md"
                type="numeric"
                value={category.categoryAmount}
                onChange={(e) => {
                  // if (tryParseInt(e.target.value)) {
                  let newCat = getNewCategory(
                    "categoryAmount",
                    e.target.value == "" ? 0 : parseInt(e.target.value)
                  );
                  setCategory(newCat);
                  // }
                }}
                onClick={(e) => e.target.select()}
              />
            </div>
          </div>

          {/* Monthly Income % (slider) */}
          <div className="flex-grow p-2 pt-1 text-center">
            <div>% of Monthly Income</div>

            <div>
              <input
                class="rounded-lg overflow-hidden appearance-none bg-gray-400 h-4 w-full"
                type="range"
                min="0"
                max="100"
                step="1"
                value={amountPercent}
                onChange={(e) => {
                  let newCat = getNewCategory(
                    "categoryAmount",
                    Math.round(monthlyAmount * (e.target.value / 100))
                  );
                  setCategory(newCat);
                }}
              />
            </div>

            <div>{amountPercent.toFixed(0) + "%"}</div>
          </div>
        </div>

        <div className="mt-5  rounded-2xl border border-gray-500 bg-gray-200 p-1">
          <h2 className="text-center font-semibold">OPTIONS</h2>

          <div className="flex justify-evenly">
            <div
              className="cursor-pointer"
              onClick={() => {
                if (showUpcoming && category.upcomingExpense) {
                  let newCat = getNewCategory("upcomingExpense", null);
                  setCategory(newCat);
                  setChangesMade(true);
                }
                setShowUpcoming(!showUpcoming);
              }}
            >
              <input type="checkbox" checked={showUpcoming} />
              {"  "}
              <span>Upcoming Expense</span>
            </div>

            <div
              className="cursor-pointer"
              onClick={() => {
                let newCat = { ...category };
                let updateTime = new Date();
                console.log("update time!");
                console.log(updateTime);
                updateTime.setMonth(updateTime.getMonth() - 1);

                console.log("update time?");
                console.log(updateTime);

                newCat.expenseType = showRegular ? null : "Monthly";
                newCat.includeOnChart = 1;
                newCat.expenseDate = showRegular ? null : new Date();
                newCat.expenseUpdateTime = showRegular ? null : updateTime;
                newCat.repeatFreqNum = showRegular ? null : 1;
                newCat.repeatFreqType = showRegular ? null : "Months";
                setCategory(newCat);

                setAutoDate(new Date());
                setShowRegular(!showRegular);
                setChangesMade(true);
              }}
            >
              <input type="checkbox" checked={showRegular} />
              {"  "}
              <span>6 Months Expense</span>
            </div>
          </div>
        </div>

        {showUpcoming && (
          <div className="mt-5  rounded-2xl border border-gray-500 bg-gray-200 p-1">
            <h2 className="text-center font-semibold">UPCOMING EXPENSE</h2>

            <div className="flex p-2 items-center">
              <h3>Enter the total purchase amount</h3>
              <input
                className="flex-grow ml-5 text-right p-2 border border-black rounded-md"
                type="numeric"
                value={category.upcomingExpense?.toString()}
                onChange={(e) => {
                  console.log(e);
                  // if (tryParseInt(e.target.value)) {
                  let newCat = getNewCategory(
                    "upcomingExpense",
                    e.target.value == "" ? null : parseInt(e.target.value)
                  );
                  setCategory(newCat);
                  // }
                }}
                onClick={(e) => e.target.select()}
              />
            </div>
          </div>
        )}

        {showRegular && (
          <div className="mt-5  rounded-2xl border border-gray-500 bg-gray-200 p-1">
            <h2 className="text-center font-semibold">REGULAR EXPENSE</h2>

            <div className="flex justify-evenly my-3">
              <div>
                <select
                  className="border border-black"
                  onChange={(e) => {
                    let newCat = { ...category };
                    newCat.expenseType = e.target.value;

                    if (newCat.expenseType == "By Date") {
                      newCat.expenseDate = new Date();
                      let updateTime = new Date();
                      updateTime.setMonth(updateTime.getMonth() - 1);
                      newCat.expenseUpdateTime = updateTime;
                    } else {
                      newCat.expenseDate = null;
                      newCat.expenseUpdateTime = null;
                    }

                    setCategory(newCat);
                  }}
                  value={category.expenseType}
                >
                  <option>Monthly</option>
                  <option>By Date</option>
                </select>
              </div>
              <div
                className="cursor-pointer"
                onClick={(e) => {
                  let newCat = getNewCategory(
                    "includeOnChart",
                    category.includeOnChart == 0 ||
                      category.includeOnChart == null
                      ? 1
                      : 0
                  );
                  setCategory(newCat);
                }}
              >
                <input type="checkbox" checked={category.includeOnChart == 1} />
                {"  "}
                <span>Include on Chart?</span>
              </div>
            </div>
            <div className="flex justify-center">
              {category.expenseType == "By Date" && (
                <div className="flex justify-evenly items-center w-full">
                  <DateTimePicker
                    autoDate={autoDate}
                    setAutoDate={setAutoDate}
                  />
                  <div
                    className="cursor-pointer"
                    onClick={(e) => {
                      let newCat = { ...category };
                      if (newCat.repeatFreqNum == null) {
                        newCat.repeatFreqNum = 1;
                        newCat.repeatFreqType = "Months";
                      } else {
                        newCat.repeatFreqNum = null;
                        newCat.repeatFreqType = null;
                      }
                      setCategory(newCat);
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={category.repeatFreqNum !== null}
                    />
                    {"  "}
                    <span>Repeat?</span>
                  </div>
                  {category.repeatFreqNum !== null && (
                    <>
                      {" "}
                      <select
                        className="border border-black"
                        onChange={(e) => {
                          let newCat = getNewCategory(
                            "repeatFreqNum",
                            parseInt(e.target.value)
                          );
                          setCategory(newCat);
                        }}
                        value={category.repeatFreqNum}
                      >
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                        <option>6</option>
                        <option>7</option>
                        <option>8</option>
                        <option>9</option>
                        <option>10</option>
                        <option>11</option>
                      </select>
                      <select
                        className="border border-black"
                        onChange={(e) => {
                          let newCat = getNewCategory(
                            "repeatFreqType",
                            e.target.value
                          );
                          setCategory(newCat);
                        }}
                        value={category.repeatFreqType}
                      >
                        <option>Months</option>
                        <option>Years</option>
                      </select>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BudgetCategoryInfo;
