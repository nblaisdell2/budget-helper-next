var sql = require("./sqlConfig");

export default function handler(req, res) {
  let params = {
    UserID: req.body.UserID,
    BudgetID: req.body.BudgetID,
    Details: req.body.CategoryDetails,
  };

  sql.execute(res, "spBH_UpdateCategoryDetails", params);
}
