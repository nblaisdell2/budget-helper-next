var sql = require("./sqlConfig");

export default function handler(req, res) {
  console.log("Adding new access/refresh token to database");

  console.log(sql);

  let params = [
    req.body.user_email,
    req.body.access_token,
    req.body.expires_in,
    req.body.refresh_token,
  ];
  console.log("  params");
  console.log(params);

  sql.execute(res, "spBH_YN_AddAccessToken", params);

  //   res.status(200).json({ status: "OK" });
}
