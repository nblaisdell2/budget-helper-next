const ynab = require("./ynab");

const unwantedCategories = [
  "Internal Master Category",
  "Credit Card Payments",
  "Hidden Categories",
];

export default function handler(req, res) {
  let categoryDetails = null;
  let monthDetails = null;

  ynab
    .get_budget_categories(req.query.access_token)
    .then((response) => {
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

      categoryDetails = { ...newCategories };

      // res.status(200).json(newCategories);
    })
    .then(() => {
      ynab.get_budget_months(req.query.access_token).then((response) => {
        monthDetails = response.data.budget.months;
        let newMonthDetails = [];

        let today = new Date();
        today.setDate(1);
        today.setHours(0);
        today.setMinutes(0);
        today.setSeconds(0);
        today.setMilliseconds(0);

        for (let i = 0; i < monthDetails.length; i++) {
          if (monthDetails[i].budgeted > 0) {
            let ynMonth = new Date(monthDetails[i].month);

            if (
              ynMonth.getFullYear() > today.getFullYear() ||
              (ynMonth.getFullYear() == today.getFullYear() &&
                ynMonth.getMonth() + 1 >= today.getMonth())
            ) {
              newMonthDetails.push(monthDetails[i]);
            }
          }
        }

        res.status(200).json({
          monthDetails: newMonthDetails,
          newCategories: categoryDetails,
        });
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}
