var sql = require("./sqlConfig");

export default function handler(req, res) {
  let params = {
    UserID: req.body.UserID,
    BudgetID: req.body.BudgetID,
    CategoryID: req.body.CatID,
  };

  sql.execute(res, "spBH_UpdateCategoryExpenseDate", params);
}
