var sql = require("./sqlConfig");

export default function handler(req, res) {
  let params = [req.body.user_email, req.body.user_name];
  sql.execute(res, "spBH_addNewUser", params);
}
