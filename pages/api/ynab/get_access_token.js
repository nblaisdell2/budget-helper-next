const ynab = require("./ynab");

export default function handler(req, res) {
  console.log("Getting YNAB Access Token");

  console.log(req.body.params);
  ynab
    .get_ynab_oauth_token(req.body.params)
    .then((response) => {
      console.log("Got OAuth Token!");
      console.log(response);
      res.status(200).json(response);
    })
    .catch((e) => {
      // console.log(e);
      console.log(e.response.data.error);
      console.log(e.response.data.error_description);
    });
}
