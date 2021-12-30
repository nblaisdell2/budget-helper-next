import { useState } from "react";
import AutomationEditModal from "./AutomationEditModal";
import AutomationReviewModal from "./AutomationReviewModal";
import Axios from "axios";
import Router from "next/router";

function AutomationModal({
  userList,
  closeModal,
  userDetails,
  setUserDetails,
  nextAutoRuns,
  setNextAutoRuns,
  listItems,
}) {
  const [showReview, setShowReview] = useState(
    userDetails.NextAutomatedRun ? true : false
  );
  const [scheduleChanged, setScheduleChanged] = useState(false);

  const [setupType, setSetupType] = useState(null);
  // const [frequency, setFrequency] = useState(null);
  const [dayOfWeek, setDayOfWeek] = useState(null);
  const [dayOfMonth, setDayOfMonth] = useState(1);
  const [timeOfDay, setTimeOfDay] = useState("8");
  const [amPM, setAmPm] = useState("AM");
  const [autoDate, setAutoDate] = useState(new Date());

  const [tempAutoRuns, setTempAutoRuns] = useState(nextAutoRuns);

  const saveAutomationResults = () => {
    if (scheduleChanged) {
      Axios.post("/api/db/save_automation_results", {
        UserID: userDetails.UserID,
        BudgetID: userDetails.DefaultBudgetID,
        SetupType: setupType,
        AutoDate: autoDate,
        Frequency: userDetails.PayFrequency,
        DayOfWeek: dayOfWeek,
        DayOfMonth: dayOfMonth,
        TimeOfDay: timeOfDay,
        AMPM: amPM,
      })
        .then((response) => {})
        .catch((err) => {});

      Router.reload(window.location.pathname);
    } else {
      closeModal();
    }
  };

  console.log("Show Review section?");
  console.log(showReview);

  if (showReview) {
    return (
      <AutomationReviewModal
        userDetails={userDetails}
        setShowReview={setShowReview}
        nextAutoRuns={nextAutoRuns}
        setNextAutoRuns={setNextAutoRuns}
        userList={userList}
        listItems={listItems}
        saveAutomationResults={saveAutomationResults}
        tempAutoRuns={tempAutoRuns}
        setTempAutoRuns={setTempAutoRuns}
      />
    );
  }

  return (
    <AutomationEditModal
      userList={userList}
      closeModal={closeModal}
      userDetails={userDetails}
      setUserDetails={setUserDetails}
      setShowReview={setShowReview}
      setScheduleChanged={setScheduleChanged}
      setupType={setupType}
      setSetupType={setSetupType}
      // frequency={frequency}
      // setFrequency={setFrequency}
      dayOfWeek={dayOfWeek}
      setDayOfWeek={setDayOfWeek}
      dayOfMonth={dayOfMonth}
      setDayOfMonth={setDayOfMonth}
      timeOfDay={timeOfDay}
      setTimeOfDay={setTimeOfDay}
      amPM={amPM}
      setAmPm={setAmPm}
      autoDate={autoDate}
      setAutoDate={setAutoDate}
      setNextAutoRuns={setNextAutoRuns}
      tempAutoRuns={tempAutoRuns}
      setTempAutoRuns={setTempAutoRuns}
    />
  );
}

export default AutomationModal;
