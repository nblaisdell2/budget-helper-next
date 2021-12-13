import { useEffect, useState } from "react";
import BudgetHelper from "../pages/BudgetHelper";
import Header from "./Header";
import Axios from "axios";
import ynab_config from "../pages/config/ynab_oauth_config.json";
import { useUser } from "@auth0/nextjs-auth0";
import Router, { useRouter } from "next/router";
import getCategoryAmountModified from "../utils";

function App() {
  const [userDetails, setUserDetails] = useState({});
  const [userCategories, setUserCategories] = useState({});
  const [userCategoryList, setUserCategoryList] = useState([]);
  const [ynabTokens, setYnabTokens] = useState({});

  const [sixMonthDetails, setSixMonthDetails] = useState({
    monthsAheadTarget: 6,
    targetMetCount: 0,
    categories: [],
  });

  const { user, isLoading } = useUser();

  const router = useRouter();

  const setYnabMonthDetails = (
    categoryList,
    monthsAheadTarget,
    ynabMonthDetails
  ) => {
    let sixMoDt = {
      monthsAheadTarget: monthsAheadTarget,
    };

    let newCats = [];
    let sixCats = [...categoryList];
    for (let i = 0; i < sixCats.length; i++) {
      let currCats = sixCats[i].categories.filter(
        (x) => x.expenseType !== null
      );
      newCats.push(...currCats);
    }

    let targetMetCount = 0;
    for (let i = 0; i < newCats.length; i++) {
      let currCat = newCats[i];
      currCat.monthsAhead = 0;

      if (ynabMonthDetails.length > 0) {
        console.log("Getting months ahead for " + currCat.name);
        console.log(ynabMonthDetails);

        let monthCat = null;
        if (currCat.expenseType == "Monthly") {
          monthCat = ynabMonthDetails[0].categories.find(
            (x) =>
              x.category_group_id == currCat.categoryGroupID &&
              x.id == currCat.id
          );
          currCat.monthsAhead =
            Math.floor(monthCat.balance / 1000 / currCat.categoryAmount) - 1;
        } else {
          for (let j = ynabMonthDetails.length - 2; j >= 0; j--) {
            console.log("month");
            console.log(ynabMonthDetails[j].month);

            monthCat = ynabMonthDetails[j].categories.find(
              (x) =>
                x.category_group_id == currCat.categoryGroupID &&
                x.id == currCat.id
            );

            let catAmt = currCat.categoryAmount;
            if (currCat.repeatFreqType == "Years") {
              catAmt /= currCat.repeatFreqNum * 12;
            } else {
              catAmt /= currCat.repeatFreqNum;
            }

            console.log(catAmt);
            console.log(monthCat.budgeted / 1000);

            if (monthCat.budgeted / 1000 >= catAmt) {
              currCat.monthsAhead += 1;
            }
          }
        }

        if (currCat.monthsAhead >= monthsAheadTarget) {
          targetMetCount += 1;
        }
      }
    }

    sixMoDt.categories = newCats;
    sixMoDt.targetMetCount = targetMetCount;

    console.log("setting six month details");
    console.log(sixMoDt);

    setSixMonthDetails({ ...sixMoDt });
  };

  const saveTokensLocal = (ynabTokens) => {
    let keys = Object.keys(ynabTokens);
    for (let i = 0; i < keys.length; i++) {
      sessionStorage.setItem(keys[i], ynabTokens[keys[i]]);
    }
  };

  const getRefreshToken = (ynabTokens) => {
    // First, check to see if the token has already expired
    // If it's still valid, no need to check for a refresh
    if (
      ynabTokens.expirationDate &&
      new Date() > new Date(ynabTokens.expirationDate)
    ) {
      // If we need a new access token, access the YNAB API to
      // request a new access token with the 'refreshToken' we were provided
      // the first time.
      console.log("  getting refresh token from YNAB");
      Axios.post("/api/ynab/get_access_token", {
        params: {
          client_id: ynab_config.CLIENT_ID,
          client_secret: ynab_config.CLIENT_SECRET,
          grant_type: "refresh_token",
          refresh_token: ynabTokens.refreshToken,
        },
      })
        .then((response) => {
          // Once we receive a new access/refresh token, we should save the results
          // in our state variable "ynabTokens"
          console.log("  Refreshing ynab tokens");
          console.log(response);

          let newExpirDate = new Date();
          let expireSeconds = response.data.expires_in;
          newExpirDate.setSeconds(newExpirDate.getSeconds() + expireSeconds);

          console.log(newExpirDate);

          let newTokens = {
            accessToken: response.data.access_token,
            expirationDate: newExpirDate.toISOString(),
            refreshToken: response.data.refresh_token,
          };
          setYnabTokens(newTokens);

          return { tokens: newTokens, expireSeconds: expireSeconds };
        })
        .then((data) => {
          // Lastly, if the user is logged in, we should also make this change
          // in the database
          if (user) {
            console.log("updating access token in DB after refresh");
            console.log(data.tokens);
            console.log(user);

            Axios.post("/api/db/update_ynab_access_token", {
              user_name: user.email,
              access_token: data.tokens.accessToken,
              expires_in: data.expireSeconds,
              refresh_token: data.tokens.refreshToken,
            }).catch((e) => {
              console.log(e);
            });
          }
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  const getUser = (newUserID) => {
    // If the user is logged in, attempt to pull their information from the database (email, monthly amount, ynab tokens, etc.)
    // Otherwise, use sessionStorage to just pull the ynab tokens
    console.log("what does the user look like on new user?");
    console.log(user);

    if (user) {
      console.log("[APP]      Attempting to get User Details from DB.");

      Axios.post("/api/db/get_user_details/", {
        params: {
          user_email: user.email,
        },
      })
        .then((response) => {
          console.log("response");
          console.log(response);

          if (response.data.length === 0) {
            console.log("[APP]      No user found.");
            addUser();
          } else {
            console.log(
              "[APP]      User found in DB! Setting details and token."
            );

            // If a NEW user logs in, if there were any results saved from the previous session, let's save
            // the results to the database so they don't have to start over.
            let newUserDetails = { ...response.data[0] };

            if (newUserID !== null) {
              saveSessionResultsInDB(newUserDetails);
            }

            // Then, clear the sessionStorage so when they log out, a new session begins and the previous
            // results are discarded.
            console.log("About to clear session storage!");
            sessionStorage.clear();

            console.log("What are my user details?");
            console.log(newUserDetails);

            setUserDetails(newUserDetails);
            setYnabTokens({
              accessToken: newUserDetails.AccessToken,
              expirationDate: newUserDetails.ExpirationDate,
              refreshToken: newUserDetails.RefreshToken,
            });
          }
        })
        .catch((e) => {
          console.log("Error");
          console.log(e);
        });
    } else {
      console.log("Attempting to read local storage...");
      let existingTokens = {
        accessToken: sessionStorage.getItem("accessToken"),
        expirationDate: sessionStorage.getItem("expirationDate"),
        refreshToken: sessionStorage.getItem("refreshToken"),
      };
      console.log(existingTokens);
      if (existingTokens.accessToken !== null) {
        setYnabTokens(existingTokens);
      }

      console.log(
        "setting userDetails monthlyAmount from session storage in APP"
      );
      let monthlyAmt = sessionStorage.getItem("monthlyAmount");
      console.log("monthly Amount in session storage");
      console.log(monthlyAmt);

      setUserDetails({
        MonthlyAmount: monthlyAmt ? parseInt(monthlyAmt) : 0,
      });
    }
  };

  const addUser = () => {
    console.log("[APP]      adding user...");

    Axios.post("/api/db/add_user", {
      user_email: user.email,
      user_name: user.nickname,
    }).then((response) => {
      console.log("[APP]      User Added!");
      let newUserID = response.data[0].UserID;

      getUser(newUserID);
    });
  };

  const getCategories = (accToken) => {
    if (accToken) {
      console.log("Am i getting categories? " + accToken);
      Axios.get("/api/ynab/get_budget_categories", {
        params: {
          access_token: accToken,
        },
      })
        .then((response) => {
          console.log("[APP] Got YNAB Categories!");
          console.log(response);

          let newCategories = { ...response.data.newCategories };
          let monthDetails = [...response.data.monthDetails];

          // First, check to see if there are any stored categories
          // This can be from the database, if logged in, or from sessionStorage otherwise.
          if (!user) {
            let storedCategories = sessionStorage.getItem("userList");
            if (storedCategories) {
              console.log("found stored categories");
              console.log(JSON.parse(storedCategories));

              let currUserList = JSON.parse(storedCategories);
              setUserCategoryList(currUserList);

              for (let i = 0; i < currUserList.length; i++) {
                let currGroup = newCategories.category_groups?.find(
                  (x) => x.id == currUserList[i].id
                );

                if (currGroup) {
                  console.log("currGroup");
                  console.log(currGroup);

                  console.log("currGroupUser");
                  console.log(currUserList[i].categories);

                  for (let j = 0; j < currUserList[i].categories.length; j++) {
                    let currCat = currGroup.categories.find(
                      (x) => x.id == currUserList[i].categories[j].id
                    );
                    if (currCat) {
                      currCat.inUserList = true;
                    }
                  }
                }
              }
            }
          } else {
            sessionStorage.removeItem("userList");

            console.log("Querying Database for Category Details");
            console.log(userDetails);

            Axios.get("/api/db/get_category_details", {
              params: {
                UserID: userDetails.UserID,
                BudgetID: userDetails.DefaultBudgetID,
              },
            }).then((response) => {
              console.log("Got category details from DB");
              console.log(response.data);

              let dbUserList = [...response.data];

              // Loop through the YNAB category groups
              // When one is found in our dbUserList,
              //  take the name/id from the ynab list and create a new array of categories
              //  then, loop through each of the found categories, grab the name/id from the ynab list, and append the amount/expensetype/etc.
              let newUserList = [];
              let newUserListItem = {};
              for (let i = 0; i < newCategories.category_groups.length; i++) {
                let currGroup = newCategories.category_groups[i];
                let dbGroup = dbUserList.filter(
                  (x) => x.CategoryGroupID == currGroup.id
                );
                if (dbGroup.length > 0) {
                  newUserListItem = {
                    id: currGroup.id,
                    name: currGroup.name,
                    isExpanded: false,
                    categories: [],
                  };
                  for (let j = 0; j < currGroup.categories.length; j++) {
                    let foundCat = currGroup.categories[j];
                    let catGroup = dbGroup.find(
                      (x) => x.CategoryID == currGroup.categories[j].id
                    );
                    if (catGroup) {
                      foundCat.inUserList = true;

                      console.log("Loading category");
                      console.log(catGroup);

                      newUserListItem.categories.push({
                        id: foundCat.id,
                        categoryGroupID: foundCat.categoryGroupID,
                        name: foundCat.name,
                        categoryAmount: catGroup.CategoryAmount,
                        expenseType: catGroup.ExpenseType,
                        includeOnChart: catGroup.IncludeOnChart,
                        upcomingExpense: catGroup.UpcomingExpense,
                        expenseDate: catGroup.ExpenseDate,
                        expenseUpdateTime: catGroup.ExpenseUpdateTime,
                        repeatFreqNum: catGroup.RepeatFreqNum,
                        repeatFreqType: catGroup.RepeatFreqType,
                        useCurrentMonth: catGroup.UseCurrentMonth,
                        numYearsPassed: catGroup.NumYearsPassed,
                      });
                    }
                  }
                  newUserList.push(newUserListItem);
                }
              }

              setUserCategoryList(newUserList);

              const monthsAheadTarget = 6;
              setYnabMonthDetails(newUserList, monthsAheadTarget, monthDetails);
            });
          }

          console.log("newCategories");
          console.log(newCategories);

          setUserCategories(newCategories);
        })
        .catch((err) => {
          console.log("[APP] [ERROR]");
          console.log(err);
        });
    }
  };

  const saveSessionResultsInDB = (userDetails) => {
    if (Object.keys(userDetails).length > 0) {
      console.log("about to attempt reading session storage for new user");
      console.log(userDetails);

      // Setting monthly amount for new user from previous session
      let sess_monthlyAmt = sessionStorage.getItem("monthlyAmount");
      if (sess_monthlyAmt) {
        console.log(
          "Monthly Amount was set before logging in. Setting Monthly Amount in DB!"
        );

        userDetails.MonthlyAmount = parseInt(sess_monthlyAmt);

        console.log("Updating Monthly Amount in Database");
        Axios.post("/api/db/update_monthly_amount", {
          UserID: userDetails.UserID,
          MonthlyAmount: userDetails.MonthlyAmount,
        })
          .then((repsonse) => {
            console.log("Updated Monthly amount in DB successfully!");
          })
          .catch((err) => {
            console.log(err);
          });
      }

      // Setting YNAB tokens for new user from previous session
      let sess_defBudID = sessionStorage.getItem("defaultBudgetID");
      if (sess_defBudID) {
        let sess_accToken = sessionStorage.getItem("accessToken");
        let sess_refToken = sessionStorage.getItem("refreshToken");
        let sess_expDate = sessionStorage.getItem("expirationDate");

        userDetails.DefaultBudgetID = sess_defBudID;
        userDetails.AccessToken = sess_accToken;
        userDetails.RefreshToken = sess_refToken;
        userDetails.ExpirationDate = sess_expDate;

        console.log(
          "YNAB Tokens were set before logging in. Setting YNAB details in DB!"
        );
        Axios.post("/api/db/update_default_budget_id", {
          UserID: userDetails.UserID,
          BudgetID: userDetails.DefaultBudgetID,
        })
          .then((repsonse) => {
            console.log("Default Budget ID Updated in DB!");

            console.log(
              "User is logged in, so updating YNAB tokens in database, as well."
            );
            Axios.post("/api/db/add_ynab_access_token", {
              user_email: userDetails.UserEmail,
              access_token: userDetails.AccessToken,
              expires_in: 7200, // eventually, get this from YNAB in case the number ever changes in the API
              refresh_token: userDetails.RefreshToken,
            });
          })
          .catch((err) => {
            console.log(err);
          });

        // Setting YNAB categories for new user from previous session
        let sess_userList = sessionStorage.getItem("userList");
        if (sess_userList) {
          console.log(
            "User list set before logging in. Setting user list details in dB!"
          );
          console.log(sess_userList);

          Axios.post("/api/db/save_category_results", {
            UserID: userDetails.UserID,
            BudgetID: userDetails.DefaultBudgetID,
            CategoryDetails: sess_userList,
          })
            .then((response) => {
              console.log("Category Details save to database!");
              console.log(response);
            })
            .catch((err) => {
              console.log(err);
            });
        }
      }
    }
  };

  // On First Load
  useEffect(() => {
    if (!isLoading) {
      console.log("[APP] App Initializing");

      if (router.asPath && router.asPath.substring(0, 6) == "/?code") {
        console.log(
          "  Got code: " +
            router.asPath.substring(7) +
            ". Getting access token from YNAB API"
        );

        Axios.post("/api/ynab/get_access_token", {
          params: {
            client_id: ynab_config.CLIENT_ID,
            client_secret: ynab_config.CLIENT_SECRET,
            redirect_uri: ynab_config.REDIRECT_URI,
            grant_type: "authorization_code",
            code: router.asPath.substring(7),
          },
        }).then((response) => {
          console.log("  Got access token!");
          let accessToken = response.data.access_token;
          let newExpirDate = new Date();
          newExpirDate.setSeconds(
            newExpirDate.getSeconds() + response.data.expires_in
          );

          console.log("  Setting cached YNAB tokens");
          setYnabTokens({
            accessToken: accessToken,
            expirationDate: newExpirDate.toISOString(),
            refreshToken: response.data.refresh_token,
          });

          if (user) {
            console.log(
              "User is logged in, so updating YNAB tokens in database, as well."
            );
            Axios.post("/api/db/add_ynab_access_token", {
              user_email: user.email,
              access_token: accessToken,
              expires_in: response.data.expires_in,
              refresh_token: response.data.refresh_token,
            });
          }

          Router.push("/");
        });
      }

      // const authCode = router.query.code;

      // console.log(authCode);

      console.log("[APP]   Getting User Details");
      getUser(null);
    }
  }, [isLoading]);

  // When the accessToken from YNAB is updated/set
  useEffect(() => {
    if (Object.keys(ynabTokens).length !== 0) {
      console.log("What are my tokens?");
      console.log(ynabTokens);

      console.log("Access Token Changed: " + ynabTokens.accessToken);

      // If the YNAB tokens are updated, and the user is not logged in, we should store
      // the tokens in sessionStorage, as well.
      if (
        !user &&
        ynabTokens.accessToken !== sessionStorage.getItem("accessToken")
      ) {
        console.log("Storing new tokens in local storage");
        saveTokensLocal(ynabTokens);
      }

      // Then, check to see if the tokens need to be refreshed, based on the expiration date
      // of the access token
      getRefreshToken(ynabTokens);

      if (userDetails.DefaultBudgetID == null) {
        console.log("Should use YNAB API to get default budget id");
        Axios.get("/api/ynab/get_budget_id", {
          params: {
            access_token: ynabTokens.accessToken,
          },
        }).then((response) => {
          console.log("Got Budget ID");
          console.log(response.data);

          let newUserDetails = { ...userDetails };
          newUserDetails.DefaultBudgetID = response.data;
          setUserDetails(newUserDetails);

          if (user) {
            Axios.post("/api/db/update_default_budget_id", {
              UserID: userDetails.UserID,
              BudgetID: response.data,
            })
              .then((repsonse) => {
                console.log("Default Budget ID Updated in DB!");
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            sessionStorage.setItem("defaultBudgetID", response.data);
          }
        });
      }

      getCategories(ynabTokens.accessToken);
    }
  }, [ynabTokens]);

  useEffect(() => {
    if (!user && userCategoryList.length > 0) {
      console.log(
        "user is not logged in, so I should update the session storage here."
      );
      sessionStorage.setItem("userList", JSON.stringify(userCategoryList));
    }
  }, [userCategoryList]);

  return (
    <div>
      <div className="mb-5">
        <p>{new Date().toLocaleString()}</p>
        <p>{ynabTokens.expirationDate?.toLocaleString()}</p>
        <p>{new Date(ynabTokens.expirationDate).toLocaleString()}</p>
      </div>
      <Header accessToken={ynabTokens.accessToken} />
      <BudgetHelper
        categories={userCategories}
        sixMonthDetails={sixMonthDetails}
        setUserCategories={setUserCategories}
        userCategoryList={userCategoryList}
        setUserCategoryList={setUserCategoryList}
        userDetails={userDetails}
        setUserDetails={setUserDetails}
      />
    </div>
  );
}

export default App;
