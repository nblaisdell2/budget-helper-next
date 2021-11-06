const ynab = require("./ynab");

const unwantedCategories = [
  "Internal Master Category",
  "Credit Card Payments",
  "Hidden Categories",
];

export default function handler(req, res) {
  console.log("Getting YNAB Categories");

  ynab
    .get_budget_categories(req.query.access_token)
    .then((response) => {
      console.log("Got Budget Categories from YNAB!");

      let newCategories = {
        serverKnowledge: response.data.server_knowledge,
        category_groups: [],
      };

      // Removing any unwanted categories before sending back to the client
      for (let i = 0; i < response.data.category_groups.length; i++) {
        if (
          !unwantedCategories.includes(response.data.category_groups[i].name)
        ) {
          let currCatGroup = response.data.category_groups[i];
          let categoryList = [];
          let newCatGroup = {};
          if (!currCatGroup.hidden && !currCatGroup.deleted) {
            newCatGroup.id = currCatGroup.id;
            newCatGroup.name = currCatGroup.name;

            let currCategory = null;
            for (let j = 0; j < currCatGroup.categories.length; j++) {
              currCategory = currCatGroup.categories[j];

              if (!currCategory.hidden && !currCategory.deleted) {
                let newCategory = {
                  id: currCategory.id,
                  categoryGroupID: currCategory.category_group_id,
                  name: currCategory.name,
                  // This will be set when pulling the details from the database
                  // on the actual page
                  inUserList: false,
                };

                categoryList.push(newCategory);
              }
            }

            newCatGroup.categories = categoryList;
            newCategories.category_groups.push(newCatGroup);
          }
        }
      }

      res.status(200).json(newCategories);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
}
