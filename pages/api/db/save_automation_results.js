var sql = require("./sqlConfig");

export default function handler(req, res) {
  let params = {
    UserID: req.body.UserID,
    BudgetID: req.body.BudgetID,
    SetupType: req.body.SetupType,
    AutoDate: req.body.AutoDate,
    Frequency: req.body.Frequency,
    DayOfWeek: req.body.DayOfWeek,
    DayOfMonth: req.body.DayOfMonth,
    TimeOfDay: req.body.TimeOfDay,
    AMPM: req.body.AMPM,
  };

  sql.execute(res, "spBH_saveAutomationRuns", params);
}
