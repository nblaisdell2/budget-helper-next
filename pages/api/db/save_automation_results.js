var sql = require("./sqlConfig");

export default function handler(req, res) {
  console.log("Saving category details to database!");

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
  console.log("  params");
  console.log(params);

  sql.execute(res, "spBH_saveAutomationRuns", params);

  //   res.status(200).json({ status: "OK" });
}
