var sql = require("./sqlConfig");

export default function handler(req, res) {
  let params = {
    UserEmail: req.body.params.user_email,
  };
  sql.query(res, "spBH_getUserDetails", params);
}
