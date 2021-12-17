var sql = require("./sqlConfig");

export default function handler(req, res) {
  let params = {
    UserEmail: req.body.user_name,
    AccessToken: req.body.access_token,
    ExpiresIn: req.body.expires_in,
    RefreshToken: req.body.refresh_token,
  };

  sql.execute(res, "spBH_YN_UpdateAccessToken", params);
}
