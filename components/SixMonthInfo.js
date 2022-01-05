import PencilAltIcon from "@heroicons/react/outline/PencilAltIcon";
import CheckIcon from "@heroicons/react/outline/CheckIcon";
import { useEffect, useState } from "react";
import Axios from "axios";
import { getSixMonthTargetMetCount } from "../utils";
import MyModal from "./MyModal";

function SixMonthInfo({
  userDetails,
  setUserDetails,
  sixMonthDetails,
  setSixMonthDetails,
}) {
  const [editingTarget, setEditingTarget] = useState(false);
  const [tempTargetAmt, setTempTargetAmt] = useState(
    sixMonthDetails.monthsAheadTarget
  );
  const [ModalItem, setModalItem] = useState(null);

  return (
    <>
      <div className="text-right">
        <div
          className="hover:underline hover:cursor-pointer"
          onClick={() => {
            setModalItem("Initialize");
          }}
        >
          Setup Starting Budget
        </div>
        <MyModal
          currModal={ModalItem}
          userDetails={userDetails}
          setCurrModal={setModalItem}
          sixMonthDetails={sixMonthDetails}
          defaultStartAmt={250}
        />
      </div>

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
                    .then((response) => {
                      let newUserDetails = { ...userDetails };
                      newUserDetails.MonthsAheadTarget = tempTargetAmt;

                      let newSixMoDt = { ...sixMonthDetails };
                      newSixMoDt.monthsAheadTarget = tempTargetAmt;
                      newSixMoDt.targetMetCount = getSixMonthTargetMetCount(
                        newSixMoDt.categories,
                        tempTargetAmt
                      );

                      setUserDetails(newUserDetails);
                      setSixMonthDetails(newSixMoDt);

                      setEditingTarget(false);
                    })
                    .catch((err) => {});
                  // updateMontlyIncome();
                }}
              />
            </div>
          ) : (
            <div className="flex justify-evenly items-center">
              <div className="text-3xl mr-3">{tempTargetAmt}</div>
              <div>
                <PencilAltIcon
                  className="h-8 cursor-pointer hover:text-gray-500"
                  onClick={() => {
                    setEditingTarget(!editingTarget);
                  }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="mt-10 flex flex-col items-center">
          <div className="text-3xl font-bold">Categories w/ Target Met</div>
          <div className="text-3xl">
            {sixMonthDetails && sixMonthDetails.categories.length
              ? sixMonthDetails.targetMetCount +
                " / " +
                sixMonthDetails.categories.length +
                " (" +
                (
                  (sixMonthDetails.targetMetCount /
                    sixMonthDetails.categories.length) *
                  100
                ).toFixed(0) +
                "%)"
              : "N/A"}
          </div>
        </div>
      </div>
    </>
  );
}

export default SixMonthInfo;
