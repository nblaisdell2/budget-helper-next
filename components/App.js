import { useEffect, useState } from "react";
import Router, { useRouter } from "next/router";
import { useUser } from "@auth0/nextjs-auth0";
import Axios from "axios";

import BudgetHelper from "../pages/BudgetHelper";
import Header from "./Header";

import ynab_config from "../pages/config/ynab_oauth_config.json";
import {
  getLatestBalance,
  getSixMonthTargetMetCount,
  setMonthDetails,
} from "../utils.js";

function App() {
  const [userDetails, setUserDetails] = useState({});
  const [nextAutoRuns, setNextAutoRuns] = useState([]);
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

  const saveSessionResultsInDB = (userDetails) => {
    if (Object.keys(userDetails).length > 0) {
      console.log("Saving session results to database, maybe!");

      // Setting monthly amount for new user from previous session
      let sess_monthlyAmt = sessionStorage.getItem("monthlyAmount");
      if (sess_monthlyAmt) {
        userDetails.MonthlyAmount = parseInt(sess_monthlyAmt);

        Axios.post("/api/db/update_monthly_amount", {
          UserID: userDetails.UserID,
          MonthlyAmount: userDetails.MonthlyAmount,
        })
          .then((repsonse) => {})
          .catch((err) => {});
      }

      // Setting paycheck frequency for new user from previous session
      let sess_payFrequency = sessionStorage.getItem("payFrequency");
      console.log("Did we get a pay frequency?");
      console.log(sess_payFrequency);

      if (sess_payFrequency) {
        userDetails.PayFrequency = sess_payFrequency;

        Axios.post("/api/db/update_pay_frequency", {
          UserID: userDetails.UserID,
          PayFrequency: sess_payFrequency,
        })
          .then((response) => {
            console.log("Got response from updating pay frequency!");
            console.log(response);
          })
          .catch((err) => {
            console.log("Error from database");
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

        Axios.post("/api/db/update_default_budget_id", {
          UserID: userDetails.UserID,
          BudgetID: userDetails.DefaultBudgetID,
        })
          .then((repsonse) => {
            Axios.post("/api/db/add_ynab_access_token", {
              user_email: userDetails.UserEmail,
              access_token: userDetails.AccessToken,
              expires_in: 7200, // eventually, get this from YNAB in case the number ever changes in the API
              refresh_token: userDetails.RefreshToken,
            });
          })
          .catch((err) => {});

        // Setting YNAB categories for new user from previous session
        let sess_userList = sessionStorage.getItem("userList");
        if (sess_userList) {
          Axios.post("/api/db/save_category_results", {
            UserID: userDetails.UserID,
            BudgetID: userDetails.DefaultBudgetID,
            CategoryDetails: sess_userList,
          })
            .then((response) => {})
            .catch((err) => {});
        }
      }
    }
  };

  const saveYNABAccessToken = () => {
    Axios.post("/api/ynab/get_access_token", {
      params: {
        client_id: ynab_config.CLIENT_ID,
        client_secret: ynab_config.CLIENT_SECRET,
        redirect_uri: ynab_config.REDIRECT_URI,
        grant_type: "authorization_code",
        code: router.asPath.substring(7),
      },
    }).then((response) => {
      let accessToken = response.data.access_token;
      let newExpirDate = new Date();
      newExpirDate.setSeconds(
        newExpirDate.getSeconds() + response.data.expires_in
      );

      setYnabTokens({
        accessToken: accessToken,
        expirationDate: newExpirDate.toISOString(),
        refreshToken: response.data.refresh_token,
      });

      if (user) {
        Axios.post("/api/db/add_ynab_access_token", {
          user_email: user.email,
          access_token: accessToken,
          expires_in: response.data.expires_in,
          refresh_token: response.data.refresh_token,
        });
      }

      Router.push("/");
    });
  };

  const getUser = (newUserID) => {
    // If the user is logged in, attempt to pull their information from the database (email, monthly amount, ynab tokens, etc.)
    // Otherwise, use sessionStorage to just pull the ynab tokens
    if (user) {
      Axios.post("/api/db/get_user_details/", {
        params: {
          user_email: user.email,
        },
      })
        .then((response) => {
          console.log("user details from database");
          console.log(response);
          if (response.data[0].length === 0) {
            addUser();
          } else {
            console.log("What is the new user id?");
            console.log(newUserID);

            // If a NEW user logs in, if there were any results saved from the previous session, let's save
            // the results to the database so they don't have to start over.
            let newUserDetails = { ...response.data[0][0] };
            setNextAutoRuns([...response.data[1]]);

            if (newUserID !== null) {
              saveSessionResultsInDB(newUserDetails);
            }

            // Then, clear the sessionStorage so when they log out, a new session begins and the previous
            // results are discarded.
            sessionStorage.clear();

            setUserDetails(newUserDetails);
            setYnabTokens({
              accessToken: newUserDetails.AccessToken,
              expirationDate: newUserDetails.ExpirationDate,
              refreshToken: newUserDetails.RefreshToken,
            });
          }
        })
        .catch((e) => {});
    } else {
      let monthlyAmt = sessionStorage.getItem("monthlyAmount");
      let payFreq = sessionStorage.getItem("payFrequency");
      setUserDetails({
        MonthlyAmount: monthlyAmt ? parseInt(monthlyAmt) : 0,
        PayFrequency: payFreq ? payFreq : "Every 2 Weeks",
      });

      let existingTokens = {
        accessToken: sessionStorage.getItem("accessToken"),
        expirationDate: sessionStorage.getItem("expirationDate"),
        refreshToken: sessionStorage.getItem("refreshToken"),
      };

      if (existingTokens.accessToken !== null) {
        setYnabTokens(existingTokens);
      }
    }
  };

  const addUser = () => {
    console.log("ADDING USER");

    Axios.post("/api/db/add_user", {
      user_email: user.email,
      user_name: user.nickname,
    }).then((response) => {
      let newUserID = response.data[0].UserID;
      console.log("NEW USER ID");
      console.log(newUserID);

      getUser(newUserID);
    });
  };

  // On First Load
  useEffect(() => {
    if (!isLoading) {
      // Check to see if we are returning to the page from Connecting to YNAB.
      // If so, use the code returned by them to get an API access token
      if (router.asPath && router.asPath.substring(0, 6) == "/?code") {
        saveYNABAccessToken();
      }

      // Then, get the user's details.
      // Using "null" since we're not adding a "new" user
      getUser(null);
    }
  }, [isLoading]);

  const saveTokensLocal = () => {
    let keys = Object.keys(ynabTokens);
    for (let i = 0; i < keys.length; i++) {
      sessionStorage.setItem(keys[i], ynabTokens[keys[i]]);
    }
  };

  const getRefreshToken = () => {
    // First, check to see if the token has already expired
    // If it's still valid, no need to check for a refresh
    console.log("Getting refresh tokens?");
    console.log(ynabTokens);

    if (
      ynabTokens.expirationDate &&
      new Date() > new Date(ynabTokens.expirationDate)
    ) {
      // If we need a new access token, access the YNAB API to
      // request a new access token with the 'refreshToken' we were provided
      // the first time.
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
          let newExpirDate = new Date();
          let expireSeconds = response.data.expires_in;
          newExpirDate.setSeconds(newExpirDate.getSeconds() + expireSeconds);

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
            Axios.post("/api/db/update_ynab_access_token", {
              user_name: user.email,
              access_token: data.tokens.accessToken,
              expires_in: data.expireSeconds,
              refresh_token: data.tokens.refreshToken,
            }).catch((e) => {});
          }
        })
        .catch((e) => {});
    }
  };

  const getCategories = () => {
    if (ynabTokens.accessToken) {
      Axios.get("/api/ynab/get_budget_categories", {
        params: {
          access_token: ynabTokens.accessToken,
        },
      })
        .then((response) => {
          console.log("Repsonse from YNAB");
          console.log(response);

          let newCategories = { ...response.data.newCategories };
          let monthDetails = [...response.data.monthDetails];
          setMonthDetails(monthDetails);

          console.log(monthDetails);

          // First, check to see if there are any stored categories
          // This can be from the database, if logged in, or from sessionStorage otherwise.
          if (!user) {
            let storedCategories = sessionStorage.getItem("userList");
            if (storedCategories) {
              let currUserList = JSON.parse(storedCategories);

              for (let i = 0; i < currUserList.length; i++) {
                let currGroup = newCategories.category_groups?.find(
                  (x) => x.id == currUserList[i].id
                );

                if (currGroup) {
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

              setUserCategoryList(currUserList);
            }
          } else {
            sessionStorage.removeItem("userList");

            Axios.get("/api/db/get_category_details", {
              params: {
                UserID: userDetails.UserID,
                BudgetID: userDetails.DefaultBudgetID,
              },
            }).then((response) => {
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

                      newUserListItem.categories.push({
                        id: foundCat.id,
                        categoryGroupID: foundCat.categoryGroupID,
                        name: foundCat.name,
                        categoryAmount: catGroup.CategoryAmount,
                        expenseType: catGroup.ExpenseType,
                        includeOnChart: catGroup.IncludeOnChart,
                        upcomingExpense: catGroup.UpcomingExpense,
                        expenseDate: catGroup.ExpenseDate,
                        expenseMonthsDivisor: catGroup.ExpenseMonthsDivisor,
                        repeatFreqNum: catGroup.RepeatFreqNum,
                        repeatFreqType: catGroup.RepeatFreqType,
                        useCurrentMonth: catGroup.UseCurrentMonth,
                        toggleInclude: catGroup.ToggleInclude,
                      });
                    }
                  }
                  newUserList.push(newUserListItem);
                }
              }

              setUserCategoryList(newUserList);

              setYnabSixMonthDetails(
                newUserList,
                userDetails.MonthsAheadTarget
              );
            });
          }

          setUserCategories(newCategories);
        })
        .catch((err) => {
          console.log("Error from YNAB");
          getRefreshToken();
        });
    }
  };

  const setYnabSixMonthDetails = (categoryList, monthsAheadTarget) => {
    let sixMoDt = {
      monthsAheadTarget: monthsAheadTarget,
    };

    let newCats = [];
    let sixCats = [...categoryList];
    for (let i = 0; i < sixCats.length; i++) {
      let currCats = sixCats[i].categories.filter(
        (x) => x.expenseType !== null
      );
      for (let j = 0; j < currCats.length; j++) {
        currCats[j].balance = getLatestBalance(currCats[j].id);
      }
      newCats.push(...currCats);
    }

    console.log("SETTING SIX MONTHS AGAIN!");
    console.log(newCats);

    sixMoDt.categories = newCats;

    sixMoDt.targetMetCount = getSixMonthTargetMetCount(
      newCats,
      monthsAheadTarget
    );

    setSixMonthDetails({ ...sixMoDt });
  };

  // When the accessToken from YNAB is updated/set
  useEffect(() => {
    if (Object.keys(ynabTokens).length !== 0) {
      // If the YNAB tokens are updated, and the user is not logged in, we should store
      // the tokens in sessionStorage, as well.
      if (
        !user &&
        ynabTokens.accessToken !== sessionStorage.getItem("accessToken")
      ) {
        saveTokensLocal();
      }

      // Then, check to see if the tokens need to be refreshed, based on the expiration date
      // of the access token
      // NOTE: If the expiration date is not passed, nothing will happen in this function
      getRefreshToken();

      // If the "DefaultBudgetID" is not set, get it from the YNAB API here and load it into
      // local storage if not logged in, and the database if they are logged in
      if (userDetails.DefaultBudgetID == null) {
        Axios.get("/api/ynab/get_budget_id", {
          params: {
            access_token: ynabTokens.accessToken,
          },
        }).then((response) => {
          let newUserDetails = { ...userDetails };
          newUserDetails.DefaultBudgetID = response.data;
          setUserDetails(newUserDetails);

          if (user) {
            Axios.post("/api/db/update_default_budget_id", {
              UserID: userDetails.UserID,
              BudgetID: response.data,
            })
              .then((repsonse) => {})
              .catch((err) => {});
          } else {
            sessionStorage.setItem("defaultBudgetID", response.data);
          }
        });
      }

      getCategories();
    }
  }, [ynabTokens]);

  useEffect(() => {
    if (!user && userCategoryList.length > 0) {
      sessionStorage.setItem("userList", JSON.stringify(userCategoryList));
    }
  }, [userCategoryList]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <Header accessToken={ynabTokens.accessToken} />
      <BudgetHelper
        nextAutoRuns={nextAutoRuns}
        setNextAutoRuns={setNextAutoRuns}
        sixMonthDetails={sixMonthDetails}
        setSixMonthDetails={setSixMonthDetails}
        categories={userCategories}
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
