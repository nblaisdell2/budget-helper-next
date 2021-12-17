const Axios = require("axios");
var baseURL = "https://api.youneedabudget.com/v1";

module.exports.get_budget_id = function (accToken) {
  return Axios.get(baseURL + "/budgets/default", {
    headers: {
      Authorization: "Bearer " + accToken,
    },
  }).then((response) => response.data.data.budget.id);
};

module.exports.get_budget_categories = function (
  accToken,
  budgetID = "default"
) {

  return Axios.get(baseURL + "/budgets/" + budgetID + "/categories", {
    headers: {
      Authorization: "Bearer " + accToken,
    },
  })
    .then((response) => response.data)
    .catch((err) => {
    });
};

module.exports.get_budget_months = function (accToken, budgetID = "default") {
  return Axios.get(baseURL + "/budgets/" + budgetID, {
    headers: {
      Authorization: "Bearer " + accToken,
    },
  })
    .then((response) => response.data)
    .catch((err) => {
    });
};

module.exports.get_ynab_category_list = function (
  accToken,
  budgetID = "default"
) {
  let categories = [];

  return module.exports
    .get_budget_categories(accToken, budgetID)
    .then((response) => {
      let category_groups = response.data.category_groups;
      let newCategory;

      let currCategory;
      let subCategories;
      let currSub;
      for (let i = 0; i < category_groups.length; i++) {
        currCategory = category_groups[i];
        if (currCategory.deleted || currCategory.hidden) continue;

        subCategories = currCategory.categories;
        for (let j = 0; j < subCategories.length; j++) {
          currSub = subCategories[j];
          if (currSub.deleted || currSub.hidden) continue;

          newCategory = {
            CategoryGroupID: currSub.category_group_id,
            CategoryGroupName: currCategory.name,
            CategoryID: currSub.id,
            CategoryName: currSub.name,
          };

          categories.push(newCategory);
        }
      }
    })
    .then((response) => categories);
};

module.exports.get_ynab_oauth_token = function (params) {
  return Axios.post("https://app.youneedabudget.com/oauth/token", params)
    .then((response) => response.data)
    .catch((e) => {
    });
};

module.exports.get_authorization_url = function (client_id, redirect_uri) {
  return (
    "https://app.youneedabudget.com/oauth/authorize?client_id=" +
    client_id +
    "&redirect_uri=" +
    redirect_uri +
    "&response_type=code"
  );
};
