var sql = require("./sqlConfig");

export default function handler(req, res) {
  console.log("Saving category details to database!");

  let params = {
    UserID: req.body.UserID,
    BudgetID: req.body.BudgetID,
    Details: req.body.CategoryDetails,
  };
  console.log("  params");
  console.log(params);

  sql.execute(res, "spBH_YN_UpdateCategoryDetails", params);

  //   res.status(200).json({ status: "OK" });
}
