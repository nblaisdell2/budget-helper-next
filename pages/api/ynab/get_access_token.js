const ynab = require("./ynab");

export default function handler(req, res) {
  ynab
    .get_ynab_oauth_token(req.body.params)
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((e) => {
    });
}
