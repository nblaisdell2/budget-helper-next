const ynab = require("./ynab");

export default function handler(req, res) {
  console.log("Getting YNAB Budget ID");

  ynab
    .get_budget_id(req.query.access_token)
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((e) => {
      // console.log(e);
      console.log(e.response.data.error);
      console.log(e.response.data.error_description);
    });
}
