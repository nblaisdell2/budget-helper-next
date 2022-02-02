import PencilAltIcon from "@heroicons/react/outline/PencilAltIcon";
import CheckIcon from "@heroicons/react/outline/CheckIcon";
import { useEffect, useState } from "react";
import { useUser } from "@auth0/nextjs-auth0";
import Axios from "axios";
import { ReactGoogleChartEvent, Chart } from "react-google-charts";
import { getCategoryAmountModified } from "../utils.js";
import DateTimePicker from "./DateTimePicker.js";

function BudgetChart({
  userDetails,
  setUserDetails,
  userCategoryList,
  setUserCategoryList,
}) {
  const { user, isLoading } = useUser();

  const [editingMonthlyAmount, setEditingMonthlyAmount] = useState(false);
  const [editingFrequency, setEditingFrequency] = useState(false);

  const [monthlyAmount, setMonthlyAmount] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [payFrequency, setPayFrequency] = useState("Every 2 Weeks");
  const [nextPaydate, setNextPaydate] = useState(new Date());

  const [currSelectedColumn, setCurrSelectedColumn] = useState(null);

  useEffect(() => {
    console.log("AM I IN HERE?");
    console.log(userDetails);

    if (!isLoading && Object?.keys(userDetails).length > 0) {
      setMonthlyAmount(userDetails.MonthlyAmount);
      setPayFrequency(userDetails.PayFrequency || payFrequency);
      setNextPaydate(
        (userDetails.NextPaydate
          ? new Date(userDetails.NextPaydate)
          : new Date()) || nextPaydate
      );
    }
  }, [userDetails]);

  useEffect(() => {
    if (userCategoryList.length > 0) {
      let newGrandTotal = 0;
      for (let i = 0; i < userCategoryList.length; i++) {
        for (let j = 0; j < userCategoryList[i].categories.length; j++) {
          let catAmt = getCategoryAmountModified(
            userCategoryList[i].categories[j]
          );

          newGrandTotal += catAmt;
        }
      }

      setGrandTotal(newGrandTotal);
    }
  }, [userCategoryList]);

  // useEffect(() => {
  //   if (monthlyAmount > 5000) {
  //     let newList = [...userCategoryList];
  //     for (let i = 0; i < newList.length; i++) {
  //       if (newList[i].name == "Just for Fun") {
  //         newList[i].isSelected = true;
  //       } else {
  //         newList[i].isSelected = false;
  //       }
  //     }
  //     setUserCategoryList(newList);
  //   } else {
  //     let newList = [...userCategoryList];
  //     for (let i = 0; i < newList.length; i++) {
  //       newList[i].isSelected = false;
  //     }
  //     setUserCategoryList(newList);
  //   }
  // }, [monthlyAmount]);

  const chartEvents = [
    {
      eventName: "select",
      callback: ({ chartWrapper }) => {
        const chart = chartWrapper.getChart();
        const selection = chart.getSelection();
        if (selection.length === 1) {
          const [selectedItem] = selection;
          const dataTable = chartWrapper.getDataTable();
          const { row, column } = selectedItem;

          const colName = dataTable?.getColumnLabel(column);

          let newList = [...userCategoryList];
          for (let i = 0; i < newList.length; i++) {
            if (currSelectedColumn !== null && currSelectedColumn == colName) {
              newList[i].isSelected = false;
              setCurrSelectedColumn(null);
            } else {
              if (newList[i].name == colName) {
                newList[i].isSelected = true;
              } else {
                newList[i].isSelected = false;
              }
              setCurrSelectedColumn(colName);
            }
          }
          setUserCategoryList(newList);
        }
      },
    },
  ];

  const options = {
    title: "By Category Group",
    isStacked: true,
    legend: "none",
    backgroundColor: "transparent",
    hAxis: { textPosition: "none", gridlines: { count: 0 } },
    animation: {
      startup: false,
      easing: "out",
      duration: 2000,
    },
  };
  const optionsInd = {
    title:
      "By Category" +
      (currSelectedColumn == null ? "" : " (" + currSelectedColumn + ")"),
    isStacked: true,
    legend: "none",
    backgroundColor: "transparent",
    hAxis: { textPosition: "none", gridlines: { count: 0 } },
    animation: {
      startup: false,
      easing: "inAndOut",
      duration: 1000,
    },
  };

  const chartDataGroup = () => {
    let data = [];
    let rowCols = ["Grouping"];
    let rowData = [""];

    console.log("user list");
    console.log(userCategoryList);

    for (let i = 0; i < userCategoryList.length; i++) {
      rowCols.push(userCategoryList[i].name);
      let catAmtGroup = 0;
      for (let j = 0; j < userCategoryList[i].categories.length; j++) {
        let catAmt = getCategoryAmountModified(
          userCategoryList[i].categories[j]
        );
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

    let anySelected =
      userCategoryList.filter((x) => x.name == currSelectedColumn).length > 0;
    for (let i = 0; i < userCategoryList.length; i++) {
      if (!anySelected || userCategoryList[i].name == currSelectedColumn) {
        for (let j = 0; j < userCategoryList[i].categories.length; j++) {
          rowCols.push(userCategoryList[i].categories[j].name);
          let catAmt = getCategoryAmountModified(
            userCategoryList[i].categories[j]
          );
          rowData.push(catAmt);
        }
      }
    }

    if (!anySelected) {
      rowCols.push("Unused");
      rowData.push(monthlyAmount - grandTotal);
    }
    data.push(rowCols, rowData);

    return data;
  };

  const updateMontlyIncome = () => {
    let newUserDetails = { ...userDetails };
    newUserDetails.MonthlyAmount = monthlyAmount;
    setUserDetails(newUserDetails);

    if (user) {
      // TODO: Update the database here, and only update the monthly amount
      //       for the current user
      Axios.post("/api/db/update_monthly_amount", {
        UserID: userDetails.UserID,
        MonthlyAmount: monthlyAmount,
      })
        .then((repsonse) => {})
        .catch((err) => {});
    } else {
      sessionStorage.setItem("monthlyAmount", monthlyAmount);
    }

    setEditingMonthlyAmount(false);
  };

  const updatePayFrequency = () => {
    let newUserDetails = { ...userDetails };
    newUserDetails.PayFrequency = payFrequency;
    newUserDetails.NextPaydate = nextPaydate.toISOString();
    setUserDetails(newUserDetails);

    if (user) {
      Axios.post("/api/db/update_pay_frequency", {
        UserID: userDetails.UserID,
        PayFrequency: payFrequency,
        NextPaydate: nextPaydate,
      })
        .then((response) => {
          if (
            response.data &&
            response.data[0] &&
            response.data[0].RowsDeleted
          ) {
            let newUD = { ...userDetails };
            newUD.NextAutomatedRun = null;
            setUserDetails(newUD);
          }
        })
        .catch((err) => {});
    } else {
      sessionStorage.setItem("payFrequency", payFrequency);
    }

    setEditingFrequency(false);
  };

  if (isLoading) {
    return <div></div>;
  }

  if (editingFrequency) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="flex items-center">
          <div className="text-center">
            <div className="uppercase underline text-lg font-semibold">
              Pay Frequency
            </div>
            <div className="flex flex-col mt-1">
              <div className="flex">
                <div
                  className="mr-5"
                  onClick={() => setPayFrequency("Every Week")}
                >
                  <input
                    type="radio"
                    checked={
                      (payFrequency && payFrequency == "Every Week") || false
                    }
                    onChange={() => {}}
                  />
                  <label className="ml-1 hover:cursor-pointer">
                    Every Week
                  </label>
                </div>
                <div
                  className="mr-5"
                  onClick={() => setPayFrequency("Every 2 Weeks")}
                >
                  <input
                    type="radio"
                    checked={
                      (payFrequency && payFrequency == "Every 2 Weeks") || false
                    }
                    onChange={() => {}}
                  />
                  <label className="ml-1 hover:cursor-pointer">
                    Every 2 Weeks
                  </label>
                </div>
                <div
                  className="mr-5"
                  onClick={() => setPayFrequency("Monthly")}
                >
                  <input
                    type="radio"
                    checked={
                      (payFrequency && payFrequency == "Monthly") || false
                    }
                    onChange={() => {}}
                  />
                  <label className="ml-1 hover:cursor-pointer">Monthly</label>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center ml-5">
            <div className="uppercase underline text-lg font-semibold">
              Next Paydate
            </div>
            <div>
              <DateTimePicker
                autoDate={nextPaydate}
                setAutoDate={setNextPaydate}
              />
            </div>
          </div>
        </div>

        <button
          type="button"
          className="font-bold p-3 ml-5 mt-8 w-32 rounded-md hover:underline bg-gray-300 hover:bg-blue-300 hover:text-white"
          onClick={() => {
            updatePayFrequency();
          }}
        >
          Save
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-between items-stretch">
      {/* Amounts Section */}
      <div className="flex justify-between">
        <div className={`flex w-full items-center justify-evenly`}>
          <div className="text-center">
            <div className="font-semibold text-md font-raleway">
              PAY FREQUENCY
            </div>
            <div className="flex items-center">
              <div className="font-bold text-2xl">{payFrequency}</div>
              <PencilAltIcon
                className="h-7 ml-1 cursor-pointer hover:text-gray-400"
                onClick={() => setEditingFrequency(true)}
              />
            </div>
          </div>

          <>
            <div className="flex flex-col items-center">
              <div className="font-semibold text-md font-raleway">
                MONTHLY INCOME
              </div>
              <div className="flex justify-center items-center">
                {editingMonthlyAmount ? (
                  <>
                    <input
                      className="text-right p-2 border border-black rounded-md"
                      type="numeric"
                      value={monthlyAmount}
                      onChange={(e) => {
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
              <div className="font-semibold text-md font-raleway">
                AMOUNT REMAINING
              </div>
              <div
                className={`font-bold text-3xl ${
                  parseInt((monthlyAmount - grandTotal).toFixed(0)) < 0 &&
                  "text-red-500"
                }`}
              >
                {"$" + parseInt((monthlyAmount - grandTotal).toFixed(0))}
              </div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-md font-raleway">
                AMOUNT USED
              </div>
              <div className="font-bold text-3xl">
                {"$" + grandTotal.toFixed(0)}
              </div>
            </div>
            <div className="text-center">
              <div className="font-semibold  text-md font-raleway">% USED</div>
              <div className="font-bold text-3xl">
                {(monthlyAmount == 0
                  ? 0
                  : (grandTotal / monthlyAmount) * 100
                ).toFixed(0) == "100" &&
                parseInt((monthlyAmount - grandTotal).toFixed(0)) > 0
                  ? "99"
                  : (monthlyAmount == 0
                      ? 0
                      : (grandTotal / monthlyAmount) * 100
                    ).toFixed(0) + "%"}
              </div>
            </div>
          </>
        </div>
      </div>

      {/* Google Charts section */}
      {monthlyAmount == 0 ? (
        <div></div>
      ) : (
        <div className="text-center h-[530px]">
          <div className="mt-10">
            <Chart
              chartType="BarChart"
              data={chartDataGroup()}
              options={options}
              width="100%"
              height="300px"
              legendToggle
              chartEvents={chartEvents}
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

export default BudgetChart;
