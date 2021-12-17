const ynab = require("./ynab");

export default function handler(req, res) {
  ynab
    .get_budget_id(req.query.access_token)
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((e) => {
    });
}
