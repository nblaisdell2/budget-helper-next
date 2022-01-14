import Axios from "axios";
import Router from "next/router";
import { useEffect, useState } from "react";
import DateTimePicker from "./DateTimePicker";

function AutomationEditModal({
  userList,
  closeModal,
  userDetails,
  setUserDetails,
  setShowReview,
  setScheduleChanged,
  setupType,
  setSetupType,
  // frequency,
  // setFrequency,
  dayOfWeek,
  setDayOfWeek,
  dayOfMonth,
  setDayOfMonth,
  timeOfDay,
  setTimeOfDay,
  amPM,
  setAmPm,
  autoDate,
  setAutoDate,
  setNextAutoRuns,
  tempAutoRuns,
  setTempAutoRuns,
}) {
  useEffect(() => {
    setDayOfWeek(
      new Date(userDetails.NextPaydate)
        .toLocaleDateString("en-US", { weekday: "long" })
        .substring(0, 3)
    );
    setDayOfMonth(new Date(userDetails.NextPaydate).getDate());
  }, []);

  return (
    <div className="h-[600px] flex flex-col m-5 relative">
      <div className="text-center text-2xl">Budget Automation Setup</div>

      <div className="flex justify-around items-center mt-5">
        <div onClick={() => setSetupType("One-Time")}>
          <input
            type="radio"
            checked={(setupType && setupType == "One-Time") || false}
            onChange={() => {}}
          />
          <label className="ml-1 hover:cursor-pointer">One-Time</label>
        </div>
        <div onClick={() => setSetupType("Scheduled")}>
          <input
            type="radio"
            checked={(setupType && setupType == "Scheduled") || false}
            onChange={() => {}}
          />
          <label className="ml-1 hover:cursor-pointer">Scheduled</label>
        </div>
      </div>

      {/* Results (DateTimePicker for One-Time / Frequency checkboxes for Scheduled) */}
      <div className=" h-[450px] overflow-y-auto">
        {setupType &&
          ((setupType == "One-Time" && (
            <div className="flex justify-around mt-5">
              <div className="text-center">
                <div className="uppercase underline text-lg font-semibold">
                  Choose a Day
                </div>
                <div>
                  <DateTimePicker
                    autoDate={autoDate}
                    setAutoDate={setAutoDate}
                  />
                </div>
              </div>
              <div className="text-center">
                <div className="uppercase underline text-lg font-semibold">
                  Choose a Time
                </div>

                <div className="flex justify-center">
                  <div className="p-2 bg-white rounded-lg border-2 border-blue-400">
                    <div className="flex">
                      <select
                        name="hours"
                        className="bg-transparent text-xl text-center appearance-none outline-none hover:underline hover:cursor-pointer"
                        onChange={(e) => {
                          setTimeOfDay(e.target.value);
                        }}
                        value={timeOfDay}
                      >
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                        <option value="11">11</option>
                        <option value="12">12</option>
                      </select>
                      <select
                        name="ampm"
                        className="bg-transparent ml-1 text-xl appearance-none outline-none hover:underline hover:cursor-pointer"
                        onChange={(e) => {
                          setAmPm(e.target.value);
                        }}
                        value={amPM}
                      >
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )) ||
            (setupType == "Scheduled" && (
              <div className="flex flex-col items-center">
                {(dayOfWeek || dayOfMonth) && (
                  <>
                    <div className="uppercase underline text-lg font-semibold mt-7">
                      Time of Day
                    </div>

                    {/* TimePicker */}
                    <div className="flex">
                      <div className="mt-2 p-2 bg-white rounded-lg border-2 border-blue-400">
                        <div className="flex">
                          <select
                            name="hours"
                            className="bg-transparent text-xl text-center appearance-none outline-none hover:underline hover:cursor-pointer"
                            onChange={(e) => {
                              setTimeOfDay(e.target.value);
                            }}
                            value={timeOfDay}
                          >
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                            <option value="9">9</option>
                            <option value="10">10</option>
                            <option value="11">11</option>
                            <option value="12">12</option>
                          </select>
                          <select
                            name="ampm"
                            className="bg-transparent ml-1 text-xl appearance-none outline-none hover:underline hover:cursor-pointer"
                            onChange={(e) => {
                              setAmPm(e.target.value);
                            }}
                            value={amPM}
                          >
                            <option value="AM">AM</option>
                            <option value="PM">PM</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )))}
      </div>

      {setupType &&
        (((dayOfWeek || dayOfMonth) &&
          timeOfDay &&
          amPM &&
          setupType == "Scheduled") ||
          (autoDate && timeOfDay && amPM && setupType == "One-Time")) && (
          <div>
            <button
              onClick={() => {
                setScheduleChanged(true);

                let dtWithTime = new Date(autoDate);
                let numHours =
                  amPM == "AM" ? parseInt(timeOfDay) : parseInt(timeOfDay) + 12;
                dtWithTime.setHours(numHours, 0, 0, 0);

                if (setupType == "One-Time") {
                  setAutoDate(dtWithTime);
                  setTempAutoRuns([
                    {
                      RunTime: dtWithTime.toISOString(),
                      Frequency: setupType,
                    },
                  ]);
                } else {
                  dtWithTime = new Date(userDetails.NextPaydate);
                  dtWithTime.setHours(numHours, 0, 0, 0);
                  setAutoDate(dtWithTime);

                  let newAutoRunList = [];
                  for (let i = 0; i < 10; i++) {
                    newAutoRunList.push({
                      RunTime: dtWithTime.toISOString(),
                      Frequency: userDetails.PayFrequency,
                    });
                    let dtTemp = new Date(dtWithTime);
                    switch (userDetails.PayFrequency) {
                      case "Every Week":
                        dtTemp = new Date(dtTemp.setDate(dtTemp.getDate() + 7));
                        break;
                      case "Every 2 Weeks":
                        dtTemp = new Date(
                          dtTemp.setDate(dtTemp.getDate() + 14)
                        );
                        break;
                      case "Monthly":
                        dtTemp = new Date(
                          dtTemp.setMonth(dtTemp.getMonth() + 1)
                        );
                        break;
                      default:
                        break;
                    }
                    dtWithTime = dtTemp;
                  }

                  setTempAutoRuns(newAutoRunList);
                }

                setShowReview(true);
              }}
              className="sticky bottom-0 mt-5 p-3 w-full rounded-md bg-gray-300 hover:bg-blue-500 hover:text-white font-bold"
            >
              Review
            </button>
          </div>
        )}
    </div>
  );
}

export default AutomationEditModal;
