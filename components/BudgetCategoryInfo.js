import ArrowLeft from "@heroicons/react/outline/ArrowLeftIcon";
import { useState } from "react";

function BudgetCategoryInfo({
  category,
  setCategory,
  monthlyAmount,
  setChangesMade,
}) {
  console.log("passed in category");
  console.log(category);

  const [showUpcoming, setShowUpcoming] = useState(
    category.upcomingExpense !== null
  );
  const [showRegular, setShowRegular] = useState(category.expenseType !== null);

  const getNewCategory = (prop, val) => {
    setChangesMade(true);
    let newCategory = { ...category };
    newCategory[prop] = val;
    return newCategory;
  };

  const tryParseInt = (str) => {
    var retValue = null;
    if (str !== null) {
      if (str.length > 0) {
        if (!isNaN(str)) {
          retValue = parseInt(str);
        }
      }
    }
    return retValue;
  };

  // if (category.upcomingExpense) {
  //   setShowUpcoming(true);
  // }

  // if (category.expenseType) {
  //   setShowRegular(true);
  // }

  let amountPercent = (category.categoryAmount / monthlyAmount) * 100;
  return (
    <div>
      <div className="flex justify-between">
        <ArrowLeft
          className="h-8 cursor-pointer"
          onClick={() => {
            setCategory(null);
          }}
        />
        {/* 
        {changesMade && (
          <div
            className="flex hover:underline"
            onClick={() => {
              let newCat = getNewCategory("saveChanges", true);
              setChangesMade(false);
              setCategory(newCat);
            }}
          >
            <PencilAltIcon className="h-6 cursor-pointer" />
            <h2 className="cursor-pointer">Save Changes</h2>
          </div>
        )} */}
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
                if (showRegular && category.expenseType) {
                  let newCat = { ...category };
                  newCat.expenseType = null;
                  newCat.includeOnChart = null;
                  setCategory(newCat);
                  setChangesMade(true);
                }
                setShowRegular(!showRegular);
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
                    let newCat = getNewCategory(
                      "expenseType",
                      e.target.value == "Select a Frequency..."
                        ? null
                        : e.target.value
                    );
                    setCategory(newCat);
                  }}
                  value={category.expenseType}
                >
                  <option>Select a Frequency...</option>
                  <option>Monthly</option>
                  <option>Every 2 Months</option>
                  <option>Every 3 Months</option>
                  <option>Every 6 Months</option>
                  <option>Yearly</option>
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
          </div>
        )}
      </div>
    </div>
  );
}

export default BudgetCategoryInfo;
