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
  frequency,
  setFrequency,
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
}) {
  useEffect(() => {
    setDayOfWeek(
      new Date()
        .toLocaleDateString("en-US", { weekday: "long" })
        .substring(0, 3)
    );
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
              <div>
                {/* Frequency (Weekly/Bi-weekly/Monthly) */}
                <div className="flex flex-col mt-7">
                  <div className="uppercase underline text-lg font-semibold">
                    Frequency
                  </div>
                  <div className="flex">
                    <div
                      className="mr-5"
                      onClick={() => setFrequency("Every Week")}
                    >
                      <input
                        type="radio"
                        checked={
                          (frequency && frequency == "Every Week") || false
                        }
                        onChange={() => {}}
                      />
                      <label className="ml-1 hover:cursor-pointer">
                        Every Week
                      </label>
                    </div>
                    <div
                      className="mr-5"
                      onClick={() => setFrequency("Every 2 Weeks")}
                    >
                      <input
                        type="radio"
                        checked={
                          (frequency && frequency == "Every 2 Weeks") || false
                        }
                        onChange={() => {}}
                      />
                      <label className="ml-1 hover:cursor-pointer">
                        Every 2 Weeks
                      </label>
                    </div>
                    <div
                      className="mr-5"
                      onClick={() => setFrequency("Monthly")}
                    >
                      <input
                        type="radio"
                        checked={(frequency && frequency == "Monthly") || false}
                        onChange={() => {}}
                      />
                      <label className="ml-1 hover:cursor-pointer">
                        Monthly
                      </label>
                    </div>
                  </div>
                </div>

                {/* Day of Week checkboxes (Weekly/Bi-weekly) OR Day of Month dropdown (1-31) (Monthly) */}
                <div>
                  {frequency &&
                    (((frequency == "Every Week" ||
                      frequency == "Every 2 Weeks") && (
                      <div>
                        <div className="flex flex-col mt-7">
                          <div className="uppercase underline text-lg font-semibold">
                            Day of the Week
                          </div>
                          <div className="flex">
                            <div
                              className="mr-5"
                              onClick={() => setDayOfWeek("Sun")}
                            >
                              <input
                                type="radio"
                                checked={
                                  (dayOfWeek && dayOfWeek == "Sun") || false
                                }
                                onChange={() => {}}
                              />
                              <label className="ml-1 hover:cursor-pointer">
                                Sun
                              </label>
                            </div>
                            <div
                              className="mr-5"
                              onClick={() => setDayOfWeek("Mon")}
                            >
                              <input
                                type="radio"
                                checked={
                                  (dayOfWeek && dayOfWeek == "Mon") || false
                                }
                                onChange={() => {}}
                              />
                              <label className="ml-1 hover:cursor-pointer">
                                Mon
                              </label>
                            </div>
                            <div
                              className="mr-5"
                              onClick={() => setDayOfWeek("Tue")}
                            >
                              <input
                                type="radio"
                                checked={
                                  (dayOfWeek && dayOfWeek == "Tue") || false
                                }
                                onChange={() => {}}
                              />
                              <label className="ml-1 hover:cursor-pointer">
                                Tue
                              </label>
                            </div>
                            <div
                              className="mr-5"
                              onClick={() => setDayOfWeek("Wed")}
                            >
                              <input
                                type="radio"
                                checked={
                                  (dayOfWeek && dayOfWeek == "Wed") || false
                                }
                                onChange={() => {}}
                              />
                              <label className="ml-1 hover:cursor-pointer">
                                Wed
                              </label>
                            </div>
                            <div
                              className="mr-5"
                              onClick={() => setDayOfWeek("Thu")}
                            >
                              <input
                                type="radio"
                                checked={
                                  (dayOfWeek && dayOfWeek == "Thu") || false
                                }
                                onChange={() => {}}
                              />
                              <label className="ml-1 hover:cursor-pointer">
                                Thu
                              </label>
                            </div>
                            <div
                              className="mr-5"
                              onClick={() => setDayOfWeek("Fri")}
                            >
                              <input
                                type="radio"
                                checked={
                                  (dayOfWeek && dayOfWeek == "Fri") || false
                                }
                                onChange={() => {}}
                              />
                              <label className="ml-1 hover:cursor-pointer">
                                Fri
                              </label>
                            </div>
                            <div
                              className="mr-5"
                              onClick={() => setDayOfWeek("Sat")}
                            >
                              <input
                                type="radio"
                                checked={
                                  (dayOfWeek && dayOfWeek == "Sat") || false
                                }
                                onChange={() => {}}
                              />
                              <label className="ml-1 hover:cursor-pointer">
                                Sat
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    )) ||
                      (frequency == "Monthly" && (
                        <div className="flex flex-col mt-7">
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

                {frequency && (dayOfWeek || dayOfMonth) && (
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
        ((frequency &&
          (dayOfWeek || dayOfMonth) &&
          timeOfDay &&
          amPM &&
          setupType == "Scheduled") ||
          (autoDate && timeOfDay && amPM && setupType == "One-Time")) && (
          <div>
            <button
              onClick={() => {
                setScheduleChanged(true);

                //   saveAutomationResults();

                console.log("setting auto runs");
                console.log(autoDate);

                let dtWithTime = new Date(autoDate);
                let numHours =
                  amPM == "AM" ? parseInt(timeOfDay) : parseInt(timeOfDay) + 12;
                dtWithTime.setHours(numHours, 0, 0, 0);

                if (setupType == "One-Time") {
                  setNextAutoRuns([
                    {
                      RunTime: dtWithTime.toISOString(),
                      Frequency: setupType,
                    },
                  ]);
                } else {
                  // determine how many days to add/subtract from the "dtWithTime"
                  // based on the dayOfWeek
                  if (
                    frequency == "Every Week" ||
                    frequency == "Every 2 Weeks"
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
                    }

                    dtWithTime = new Date(
                      dtWithTime.setDate(dtWithTime.getDate() + daysToAdd)
                    );
                  } else if (frequency == "Monthly") {
                    let dtTemp = new Date();
                    if (dtTemp.getDate() > dayOfMonth) {
                      dtTemp = new Date(dtTemp.setMonth(dtTemp.getMonth() + 1));
                      dtTemp = new Date(dtTemp.setDate(dayOfMonth));
                    } else {
                      dtTemp = new Date(dtTemp.setDate(dayOfMonth));
                    }
                    dtWithTime = dtTemp;
                    dtWithTime.setHours(numHours, 0, 0, 0);
                  }

                  let newAutoRunList = [];
                  for (let i = 0; i < 10; i++) {
                    newAutoRunList.push({
                      RunTime: dtWithTime.toISOString(),
                      Frequency: frequency,
                    });
                    let dtTemp = new Date(dtWithTime);
                    switch (frequency) {
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

                  setNextAutoRuns(newAutoRunList);
                }

                setShowReview(true);
              }}
              className="sticky mt-5 rounded-md bottom-0 p-3 w-full bg-gray-300 hover:bg-blue-500 hover:text-white font-bold"
            >
              Review
            </button>
          </div>
        )}
    </div>
  );
}

export default AutomationEditModal;
