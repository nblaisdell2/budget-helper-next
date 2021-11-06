var sql = require("./sqlConfig");

export default function handler(req, res) {
  console.log("Updating Default Budget ID in database");

  let params = {
    UserID: req.body.UserID,
    BudgetID: req.body.BudgetID,
  };
  console.log("  params");
  console.log(params);

  sql.execute(res, "spBH_YN_UpdateDefaultBudgetID", params);

  //   res.status(200).json({ status: "OK" });
}
