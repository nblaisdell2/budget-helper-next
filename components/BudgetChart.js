import PencilAltIcon from "@heroicons/react/outline/PencilAltIcon";
import CheckIcon from "@heroicons/react/outline/CheckIcon";
import { useEffect, useState } from "react";
import { useUser } from "@auth0/nextjs-auth0";
import Axios from "axios";
import { Chart } from "react-google-charts";

function BudgetChart({ userDetails, setUserDetails, userCategoryList }) {
  const { user, isLoading } = useUser();

  const [editingMonthlyAmount, setEditingMonthlyAmount] = useState(false);
  const [monthlyAmount, setMonthlyAmount] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);

  useEffect(() => {
    if (!isLoading && Object.keys(userDetails).length > 0) {
      console.log("monthly amount?");
      console.log(monthlyAmount);

      console.log("what are my user details, in here tho?");
      console.log(userDetails);

      setMonthlyAmount(userDetails.MonthlyAmount);
    }
  }, [userDetails]);

  useEffect(() => {
    if (userCategoryList.length > 0) {
      console.log("What's the category list?");
      console.log(userCategoryList);

      let newGrandTotal = 0;
      for (let i = 0; i < userCategoryList.length; i++) {
        for (let j = 0; j < userCategoryList[i].categories.length; j++) {
          let catAmt = userCategoryList[i].categories[j]?.categoryAmount;
          if (userCategoryList[i].categories[j]?.expenseType) {
            switch (userCategoryList[i].categories[j]?.expenseType) {
              case "Monthly":
                catAmt = catAmt;
                break;
              case "Every 2 Months":
                catAmt /= 2;
                break;
              case "Every 3 Months":
                catAmt /= 3;
                break;
              case "Every 6 Months":
                catAmt /= 6;
                break;
              case "Yearly":
                catAmt /= 12;
                break;
            }
            if (
              userCategoryList[i].categories[j].includeOnChart == 0 ||
              userCategoryList[i].categories[j].includeOnChart == null
            ) {
              catAmt = 0;
            }
          }

          newGrandTotal += catAmt;
        }
      }

      console.log("grand total");
      console.log(newGrandTotal);

      setGrandTotal(newGrandTotal);
    }
  }, [userCategoryList]);

  const options = {
    title: "By Category Group",
    isStacked: true,
    legend: "none",
    backgroundColor: "transparent",
    hAxis: { textPosition: "none", gridlines: { count: 0 } },
  };
  const optionsInd = {
    title: "By Category",
    isStacked: true,
    legend: "none",
    backgroundColor: "transparent",
    hAxis: { textPosition: "none", gridlines: { count: 0 } },
  };

  const chartDataGroup = () => {
    let data = [];
    let rowCols = ["Grouping"];
    let rowData = [""];

    for (let i = 0; i < userCategoryList.length; i++) {
      rowCols.push(userCategoryList[i].name);
      let catAmtGroup = 0;
      for (let j = 0; j < userCategoryList[i].categories.length; j++) {
        let catAmt = userCategoryList[i].categories[j]?.categoryAmount;
        if (userCategoryList[i].categories[j]?.expenseType) {
          switch (userCategoryList[i].categories[j]?.expenseType) {
            case "Monthly":
              catAmt = catAmt;
              break;
            case "Every 2 Months":
              catAmt /= 2;
              break;
            case "Every 3 Months":
              catAmt /= 3;
              break;
            case "Every 6 Months":
              catAmt /= 6;
              break;
            case "Yearly":
              catAmt /= 12;
              break;
          }
          if (
            userCategoryList[i].categories[j]?.includeOnChart == 0 ||
            userCategoryList[i].categories[j]?.includeOnChart == null
          ) {
            catAmt = 0;
          }
        }
        catAmtGroup += catAmt;
      }
      rowData.push(catAmtGroup);
    }

    rowCols.push("Unused");
    rowData.push(monthlyAmount - grandTotal);

    data.push(rowCols, rowData);
    return data;
  };

  const chartDataIndividual = () => {
    let data = [];
    let rowCols = ["Grouping"];
    let rowData = [""];

    for (let i = 0; i < userCategoryList.length; i++) {
      for (let j = 0; j < userCategoryList[i].categories.length; j++) {
        rowCols.push(userCategoryList[i].categories[j].name);
        let catAmt = userCategoryList[i].categories[j]?.categoryAmount;
        if (userCategoryList[i].categories[j]?.expenseType) {
          switch (userCategoryList[i].categories[j]?.expenseType) {
            case "Monthly":
              catAmt = catAmt;
              break;
            case "Every 2 Months":
              catAmt /= 2;
              break;
            case "Every 3 Months":
              catAmt /= 3;
              break;
            case "Every 6 Months":
              catAmt /= 6;
              break;
            case "Yearly":
              catAmt /= 12;
              break;
          }
          if (
            userCategoryList[i].categories[j]?.includeOnChart == 0 ||
            userCategoryList[i].categories[j]?.includeOnChart == null
          ) {
            catAmt = 0;
          }
        }
        rowData.push(catAmt);
      }
    }

    rowCols.push("Unused");
    rowData.push(monthlyAmount - grandTotal);

    data.push(rowCols, rowData);

    return data;
  };

  const updateMontlyIncome = () => {
    let newUserDetails = { ...userDetails };
    console.log("about to set monthly to: " + monthlyAmount);
    newUserDetails.MonthlyAmount = monthlyAmount;
    setUserDetails(newUserDetails);

    if (user) {
      // TODO: Update the database here, and only update the monthly amount
      //       for the current user
      console.log("Updating Monthly Amount in Database");
      Axios.post("/api/db/update_monthly_amount", {
        UserID: userDetails.UserID,
        MonthlyAmount: monthlyAmount,
      })
        .then((repsonse) => {
          console.log("Updated Monthly amount in DB successfully!");
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      console.log("setting monthly amount in session storage");
      console.log(monthlyAmount);
      sessionStorage.setItem("monthlyAmount", monthlyAmount);
    }

    setEditingMonthlyAmount(false);
  };

  if (isLoading) {
    return <div></div>;
  } else {
    // if (!isLoading) {

    return (
      <div className="flex flex-col justify-between items-stretch">
        {/* Amounts Section */}
        <div className="flex justify-between">
          <div className="flex w-full justify-evenly">
            <div className="flex flex-col items-center">
              <div className="font-semibold text-lg">MONTHLY INCOME</div>
              <div className="flex justify-center items-center">
                {editingMonthlyAmount ? (
                  <>
                    <input
                      className="text-right p-2 border border-black rounded-md"
                      type="numeric"
                      value={monthlyAmount}
                      onChange={(e) => {
                        console.log(
                          "it changed to this! " + e.target.value == ""
                            ? 0
                            : parseInt(e.target.value)
                        );
                        setMonthlyAmount(
                          e.target.value == "" ? 0 : parseInt(e.target.value)
                        );
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          updateMontlyIncome();
                        }
                      }}
                      onClick={(e) => e.target.select()}
                    />
                    <CheckIcon
                      className="h-8 cursor-pointer ml-1 hover:text-green-600"
                      onClick={() => {
                        updateMontlyIncome();
                      }}
                    />
                  </>
                ) : (
                  <>
                    <div className="font-bold text-3xl text-green-600">
                      {"$" + monthlyAmount}
                    </div>
                    <PencilAltIcon
                      className="h-7 ml-1 cursor-pointer hover:text-green-600"
                      onClick={() => setEditingMonthlyAmount(true)}
                    />
                  </>
                )}
              </div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-lg">AMOUNT REMAINING</div>
              <div className="font-bold text-3xl">
                {"$" + (monthlyAmount - grandTotal).toFixed(0)}
              </div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-lg">AMOUNT USED</div>
              <div className="font-bold text-3xl">
                {"$" + grandTotal.toFixed(0)}
              </div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-lg">% USED</div>
              <div className="font-bold text-3xl">
                {(monthlyAmount == 0
                  ? 0
                  : (grandTotal / monthlyAmount) * 100
                ).toFixed(0) + "%"}
              </div>
            </div>
          </div>
        </div>

        {/* Google Charts section */}
        {monthlyAmount == 0 ? (
          <div></div>
        ) : (
          <div className="text-center h-[530px]">
            <div className="mt-1">
              <Chart
                chartType="BarChart"
                data={chartDataGroup()}
                options={options}
                width="100%"
                height="300px"
                legendToggle
              />
              <Chart
                className="-mt-10"
                chartType="BarChart"
                data={chartDataIndividual()}
                options={optionsInd}
                width="100%"
                height="300px"
                legendToggle
              />
            </div>
          </div>
        )}
      </div>
    );
  }
  // }
}

export default BudgetChart;
