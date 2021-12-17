import PencilAltIcon from "@heroicons/react/outline/PencilAltIcon";
import CheckIcon from "@heroicons/react/outline/CheckIcon";
import { useState } from "react";
import Axios from "axios";

function SixMonthInfo({ userDetails, setUserDetails, sixMonthDetails }) {
  console.log(sixMonthDetails);

  const [editingTarget, setEditingTarget] = useState(false);
  const [tempTargetAmt, setTempTargetAmt] = useState(sixMonthDetails.monthsAheadTarget);

  return (
    <div className="flex flex-col justify-around items-center h-full">
      <div className="font-bold text-5xl underline">Six Month Info</div>

      <div className="mt-10 flex flex-col items-center">
        <div className="text-3xl font-bold">Months Ahead Target</div>

        {editingTarget ? (
          <div className="flex items-center mt-3">
            <input
              className="text-right p-2 border border-black rounded-md"
              type="numeric"
              value={tempTargetAmt}
              onChange={(e) => {
                setTempTargetAmt(parseInt(e.target.value));
              }}
              onKeyDown={(e) => {
                // if (e.key === "Enter") {
                //   updateMontlyIncome();
                // }
              }}
              onClick={(e) => e.target.select()}
            />
            <CheckIcon
              className="h-8 cursor-pointer ml-1 hover:text-green-600"
              onClick={() => {
                Axios.post("/api/db/update_months_ahead_target", {
                  UserID: userDetails.UserID,
                  MonthsAheadTarget: tempTargetAmt,
                })
                  .then((repsonse) => {
                    let newUserDetails = {...userDetails};
                    newUserDetails.MonthsAheadTarget = tempTargetAmt;

                    setUserDetails(newUserDetails);
                    setEditingTarget(false);
                  })
                  .catch((err) => {
                  });
                // updateMontlyIncome();
              }}
            />
          </div>
        ) : (
          <div className="flex justify-evenly items-center">
            <div className="text-3xl mr-3">
              {tempTargetAmt}
            </div>
            <div>
              <PencilAltIcon className="h-8 cursor-pointer hover:text-gray-500" onClick={() => {
                setEditingTarget(!editingTarget);
              }} />
            </div>
          </div>
        )}
      </div>

      <div className="mt-10 flex flex-col items-center">
        <div className="text-3xl font-bold">Categories w/ Target Met</div>
        <div className="text-3xl">
          {sixMonthDetails.targetMetCount +
            " / " +
            sixMonthDetails.categories.length +
            " (" +
            (
              (sixMonthDetails.targetMetCount /
                sixMonthDetails.categories.length) *
              100
            ).toFixed(0) +
            "%)"}
        </div>
      </div>
    </div>
  );
}

export default SixMonthInfo;
