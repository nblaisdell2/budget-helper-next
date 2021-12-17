var sql = require("./sqlConfig");

export default function handler(req, res) {
  let params = {
    UserID: req.body.UserID,
    MonthsAheadTarget: req.body.MonthsAheadTarget,
  };

  sql.execute(res, "spBH_UpdateMonthsAheadTarget", params);
}
