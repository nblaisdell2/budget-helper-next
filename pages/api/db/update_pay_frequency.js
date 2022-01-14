var sql = require("./sqlConfig");

export default function handler(req, res) {
  let params = {
    UserID: req.body.UserID,
    PayFrequency: req.body.PayFrequency,
    NextPaydate: req.body.NextPaydate,
  };

  sql.query(res, "spBH_UpdatePaycheckFrequency", params);
}
