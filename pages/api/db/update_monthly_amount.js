var sql = require("./sqlConfig");

export default function handler(req, res) {
  let params = {
    UserID: req.body.UserID,
    MonthlyAmount: req.body.MonthlyAmount,
  };

  sql.execute(res, "spBH_UpdateMonthlyAmount", params);
}
