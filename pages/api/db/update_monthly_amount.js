var sql = require("./sqlConfig");

export default function handler(req, res) {
  console.log("Updating Monthly Amount in database");

  let params = {
    UserID: req.body.UserID,
    MonthlyAmount: req.body.MonthlyAmount,
  };
  console.log("  params");
  console.log(params);

  sql.execute(res, "spBH_UpdateMonthlyAmount", params);

  //   res.status(200).json({ status: "OK" });
}
