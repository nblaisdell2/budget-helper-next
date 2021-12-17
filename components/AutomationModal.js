import { useState, useEffect } from "react";
import DateTimePicker from "./DateTimePicker";

import Axios from "axios";

import Router from "next/router";

function AutomationModal({
  userList,
  closeModal,
  userDetails,
  setUserDetails,
}) {
  const [setupType, setSetupType] = useState(null);
  const [frequency, setFrequency] = useState(null);
  const [dayOfWeek, setDayOfWeek] = useState(null);
  const [dayOfMonth, setDayOfMonth] = useState(1);

  const [timeOfDay, setTimeOfDay] = useState("8");
  const [amPM, setAmPm] = useState("AM");

  const [autoDate, setAutoDate] = useState(new Date());

  const saveAutomationResults = () => {
    Axios.post("/api/db/save_automation_results", {
      UserID: userDetails.UserID,
      BudgetID: userDetails.DefaultBudgetID,
      SetupType: setupType,
      AutoDate: autoDate,
      Frequency: frequency,
      DayOfWeek: dayOfWeek,
      DayOfMonth: dayOfMonth,
      TimeOfDay: timeOfDay,
      AMPM: amPM,
    })
      .then((response) => {
      })
      .catch((err) => {
      });

    closeModal();

    Router.reload(window.location.pathname);
  };

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
          <input type="radio" checked={setupType && setupType == "One-Time"} />
          <label className="ml-1 hover:cursor-pointer">One-Time</label>
        </div>
        <div onClick={() => setSetupType("Scheduled")}>
          <input type="radio" checked={setupType && setupType == "Scheduled"} />
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

                <div class="flex justify-center">
                  <div class="p-2 bg-white rounded-lg border-2 border-blue-400">
                    <div class="flex">
                      <select
                        name="hours"
                        class="bg-transparent text-xl text-center appearance-none outline-none hover:underline hover:cursor-pointer"
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
                        class="bg-transparent ml-1 text-xl appearance-none outline-none hover:underline hover:cursor-pointer"
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
                        checked={frequency && frequency == "Every Week"}
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
                        checked={frequency && frequency == "Every 2 Weeks"}
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
                        checked={frequency && frequency == "Monthly"}
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
                                checked={dayOfWeek && dayOfWeek == "Sun"}
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
                                checked={dayOfWeek && dayOfWeek == "Mon"}
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
                                checked={dayOfWeek && dayOfWeek == "Tue"}
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
                                checked={dayOfWeek && dayOfWeek == "Wed"}
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
                                checked={dayOfWeek && dayOfWeek == "Thu"}
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
                                checked={dayOfWeek && dayOfWeek == "Fri"}
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
                                checked={dayOfWeek && dayOfWeek == "Sat"}
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
                    <div class="flex">
                      <div class="mt-2 p-2 bg-white rounded-lg border-2 border-blue-400">
                        <div class="flex">
                          <select
                            name="hours"
                            class="bg-transparent text-xl text-center appearance-none outline-none hover:underline hover:cursor-pointer"
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
                            class="bg-transparent ml-1 text-xl appearance-none outline-none hover:underline hover:cursor-pointer"
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
              onClick={() => saveAutomationResults()}
              className="sticky mt-5 rounded-md bottom-0 p-3 w-full bg-gray-300 hover:bg-blue-500 hover:text-white font-bold"
            >
              Review
            </button>
          </div>
        )}
    </div>
  );
}

export default AutomationModal;
