var sql = require("./sqlConfig");

export default function handler(req, res) {
  let params = {
    UserEmail: req.body.user_email,
    UserName: req.body.user_name,
  };
  sql.query(res, "spBH_addNewUser", params);
}
