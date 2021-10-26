var sql = require("./sqlConfig");

export default function handler(req, res) {
  console.log("Adding new access/refresh token to database");

  let params = [
    req.body.user_name,
    req.body.access_token,
    req.body.expires_in,
    req.body.refresh_token,
  ];
  console.log("  params");
  console.log(params);

  sql.execute(res, "spBH_YN_UpdateAccessToken", params);

  //   res.status(200).json({ status: "OK" });
}
