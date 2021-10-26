var sql = require("./sqlConfig");

export default function handler(req, res) {
  console.log("Adding new access/refresh token to database");

  console.log(sql);

  let params = {
    UserEmail: req.body.user_email,
    AccessToken: req.body.access_token,
    ExpiresIn: req.body.expires_in,
    RefreshToken: req.body.refresh_token,
  };
  console.log("  params");
  console.log(params);

  sql.execute(res, "spBH_YN_AddAccessToken", params);

  //   res.status(200).json({ status: "OK" });
}
