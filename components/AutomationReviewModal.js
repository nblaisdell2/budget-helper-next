import MinusCircleIcon from "@heroicons/react/outline/MinusCircleIcon";
import PencilAltIcon from "@heroicons/react/outline/PencilAltIcon";
import CheckIcon from "@heroicons/react/outline/CheckIcon";
import Axios from "axios";
import Router from "next/router";

function AutomationReviewModal({
  userDetails,
  setShowReview,
  nextAutoRuns,
  setNextAutoRuns,
  userList,
  listItems,
  saveAutomationResults,
}) {
  let myListItems = listItems.filter((x) => x.amountNum > 0);
  let grandTotal = myListItems
    .filter((x) => !x.isParent)
    .reduce((a, b) => {
      return a + b.amountNum;
    }, 0);

  const deleteAutomationRuns = () => {
    Axios.post("/api/db/delete_automation_runs", {
      UserID: userDetails.UserID,
      BudgetID: userDetails.DefaultBudgetID,
    })
      .then((response) => {
        console.log("Deleted automation runs successfully!");

        Router.reload(window.location.pathname);
      })
      .catch((err) => {});
  };

  return (
    <div className="h-[600px] flex flex-col m-5 relative">
      {/* Header */}
      <div className="text-center text-2xl">Budget Automation Review</div>

      {/* Next Auto Runs List */}
      <div className="flex flex-col mt-5">
        <div className="font-bold text-xl uppercase">Next Auto Run(s)</div>
        <div className="h-[175px] w-full overflow-y-auto flex flex-col items-center border-2 border-black rounded-md">
          {nextAutoRuns?.map((v, i) => {
            return (
              <div key={i} className={`${i == 0 ? "font-bold" : ""} text-xl`}>
                {new Date(v.RunTime).toLocaleString().replace(",", " @")}
              </div>
            );
          })}
        </div>
      </div>

      {/* Total & Category Amounts */}
      <div className="mt-5">
        <div className="font-bold text-xl uppercase">
          Amounts Posted to YNAB on{" "}
          {new Date(nextAutoRuns[0].RunTime)
            .toLocaleString()
            .replace(",", " @")}
        </div>
        <div className="h-[225px] overflow-y-auto border-2 border-black rounded-md p-2">
          <div className="flex justify-between border-b-2 border-black">
            <div className="font-bold text-xl">Total</div>
            <div className="font-bold text-2xl text-green-500">
              {"$" + grandTotal.toFixed(0)}
            </div>
          </div>
          {myListItems.map((v, i) => {
            return (
              <div
                className={`flex justify-between ${
                  v.isParent ? "" : " hover:bg-gray-300"
                }`}
              >
                <div className={`${v.isParent ? "font-bold" : "ml-5"}`}>
                  {v.category}
                </div>
                <div className={`${v.isParent ? "font-bold" : ""}`}>
                  {"$" + v.amountNum.toFixed(2)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Buttons */}
      <div className="h-full w-full sticky bottom-0 flex justify-evenly items-end">
        <button
          onClick={() => {
            setNextAutoRuns([]);
            setShowReview(false);
          }}
          className="rounded-md p-3 bg-gray-300 hover:bg-blue-400 hover:text-white font-bold flex items-center"
        >
          <PencilAltIcon className="h-6 w-6 mr-1" />
          <p>Edit Schedule</p>
        </button>

        <button
          onClick={() => {
            saveAutomationResults();
          }}
          className="rounded-md p-3 bg-gray-300 hover:bg-blue-400 hover:text-white font-bold flex items-center"
        >
          <CheckIcon className="h-6 w-6 text-green-600 mr-1" />
          <p>Save and Exit</p>
        </button>

        <button
          onClick={() => {
            deleteAutomationRuns();
          }}
          className="rounded-md p-3 bg-gray-300 hover:bg-blue-400 hover:text-white font-bold flex items-center"
        >
          <MinusCircleIcon className="h-6 w-6 text-red-600 mr-1" />
          <p>Cancel Automation</p>
        </button>
      </div>
    </div>
  );
}

export default AutomationReviewModal;
