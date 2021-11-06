var sql = require("./sqlConfig");

export default function handler(req, res) {
  console.log("Getting Category Details from DB!");

  let params = {
    UserID: req.query.UserID,
    BudgetID: req.query.BudgetID,
  };

  sql.query(res, "spBH_getCategoryDetails", params);
}
