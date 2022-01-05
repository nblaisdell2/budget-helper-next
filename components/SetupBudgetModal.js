import axios from "axios";
import Axios from "axios";
import { useEffect, useState } from "react";
import SetupBudgetListItem from "./SetupBudgetListItem";
import { useUser } from "@auth0/nextjs-auth0";
import ynab_config from "../pages/config/ynab_oauth_config.json";

function SetupBudgetModal({
  closeModal,
  userDetails,
  setUserDetails,
  sixMonthDetails,
  defaultStartAmt,
}) {
  const [startAmt, setStartAmt] = useState(0);
  const [startAmtStatic, setStartAmtStatic] = useState(0);

  const [showSetup, setShowSetup] = useState(false);

  const [sixMoLocal, setSixMoLocal] = useState([]);
  const [setupCategories, setSetupCategories] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState([]);

  const { user } = useUser();

  // Returns a Promise that resolves after "ms" Milliseconds
  const timer = (ms) => new Promise((res) => setTimeout(res, ms));

  console.log(userDetails);
  var currAccToken = userDetails.AccessToken;
  var currRefToken = userDetails.RefreshToken;

  useEffect(() => {
    let catsWithMonths = getCategoriesWithMonths();
    setSetupCategories(catsWithMonths);

    if (catsWithMonths && catsWithMonths.length > 0 && startAmtStatic !== 0) {
      let parentItems = catsWithMonths.filter((x) => x.isParent);

      let totalAdd = 0;
      for (let i = 0; i < parentItems.length; i++) {
        totalAdd += parseInt(parentItems[i].totalAmount.replace("$", ""));
      }

      setStartAmt(startAmtStatic - totalAdd);
    }
  }, [expandedCategories, sixMoLocal, showSetup]);

  const addMonthToCategory = (catID) => {
    let newLocalSixMo = [...sixMoLocal];
    let item = newLocalSixMo.find((x) => x.id == catID);
    item.monthsAhead += 1;
    setSixMoLocal(newLocalSixMo);
  };

  const removeMonthFromCategory = (catID) => {
    let newLocalSixMo = [...sixMoLocal];
    let item = newLocalSixMo.find((x) => x.id == catID);
    if (item.monthsAhead > 0) {
      item.monthsAhead -= 1;
      setSixMoLocal(newLocalSixMo);
    }
  };

  const getCategoriesWithMonths = () => {
    let catsWithMonths = [];
    if (sixMoLocal) {
      for (let i = 0; i < sixMoLocal.length; i++) {
        let currCat = sixMoLocal[i];
        let isExpanded = expandedCategories.includes(currCat.name);

        let catTotalAmt = 0;
        let currAmt = 0;
        let currMonthDivisor = currCat.expenseMonthsDivisor;
        let divisorChanged = false;
        let startMonth = new Date();
        let monthArr = [];

        if (currCat.balance > 0 || currCat.monthsAhead > 0) {
          for (let j = 0; j < currCat.monthsAhead; j++) {
            if (currCat.expenseType == "Monthly") {
              currAmt = currCat.categoryAmount;
            } else {
              if (Math.ceil(catTotalAmt) >= currCat.categoryAmount) {
                currMonthDivisor =
                  currCat.repeatFreqNum *
                  (currCat.repeatFreqType == "Months" ? 1 : 12);
                divisorChanged = true;
              }
              currAmt = currCat.categoryAmount / currMonthDivisor;
            }

            if (currAmt % 100 > 0) {
              currAmt += 0.01;
            }

            catTotalAmt += currAmt;

            monthArr.push({
              isParent: false,
              isExpanded: isExpanded,
              id: currCat.id,
              divisorChanged: divisorChanged,
              month:
                startMonth.toLocaleString("default", { month: "long" }) +
                " " +
                startMonth.getFullYear(),
              numMonthsAhead: "",
              totalAmount: "$" + currAmt.toFixed(2),
            });

            if (divisorChanged) {
              divisorChanged = false;
            }

            startMonth.setMonth(startMonth.getMonth() + 1);
          }
        }

        catsWithMonths.push({
          isParent: true,
          isExpanded: isExpanded,
          id: currCat.id,
          name: currCat.name,
          numMonthsAhead:
            currCat.monthsAhead <= 0 ? 0 : currCat.monthsAhead - 1,
          totalAmount: "$" + catTotalAmt.toFixed(0),
        });
        catsWithMonths.push(...monthArr);
      }
    }

    return catsWithMonths;
  };

  const saveToYNAB = async () => {
    let parentItems = setupCategories.filter((x) => x.isParent);
    var foundDivisorChanged = false;

    for (let i = 0; i < parentItems.length; i++) {
      let catTotalAmt = parseInt(parentItems[i].totalAmount.replace("$", ""));
      if (catTotalAmt > 0) {
        let monthsToSave = setupCategories.filter(
          (x) => !x.isParent && x.id == parentItems[i].id
        );
        foundDivisorChanged = false;
        for (let j = 0; j < monthsToSave.length; j++) {
          await timer(1000);

          let ynabURI =
            "https://api.youneedabudget.com/v1/budgets/" +
            userDetails.DefaultBudgetID +
            "/months/" +
            new Date(monthsToSave[j].month).toISOString().slice(0, 10) +
            "/categories/" +
            monthsToSave[j].id;

          let monthAmt = monthsToSave[j].totalAmount.replace("$", "");
          // if (monthAmt % 100 > 0) {
          //   monthAmt += 0.01;
          // }

          let postData = {
            category: {
              budgeted: parseInt(parseFloat(monthAmt) * 1000),
            },
          };

          console.log(
            "Posting amount for   " +
              parentItems[i].name +
              " on " +
              monthsToSave[j].month +
              " (" +
              parseFloat(monthAmt).toString() +
              ")"
          );

          if (monthsToSave[j].divisorChanged && !foundDivisorChanged) {
            foundDivisorChanged = true;

            Axios.post("/api/db/update_category_expense_date", {
              UserID: userDetails.UserID,
              BudgetID: userDetails.DefaultBudgetID,
              CatID: monthsToSave[j].id,
            })
              .then((response) => {
                console.log(
                  "Updated expense months divisor for category: " +
                    monthsToSave[j].name
                );

                Axios.patch(ynabURI, postData, {
                  headers: {
                    Authorization: "Bearer " + currAccToken,
                  },
                })
                  .then((response) => {
                    console.log("Added data to YNAB successfully!");
                    // console.log(response);
                    console.log(response.headers["x-rate-limit"]);
                    let rateLim = response.headers["x-rate-limit"];
                    let rateLimLeft = parseInt(
                      rateLim.substring(0, rateLim.indexOf("/"))
                    );
                    if (rateLimLeft >= 180) {
                      getNewTokens(currRefToken).then((data) => {
                        // console.log("What did I get for data?");
                        // console.log(data);

                        currAccToken = data[0];
                        currRefToken = data[1];
                      });
                    }
                  })
                  .catch((err) => {
                    console.log("Error from YNAB");
                    console.log(err);
                  });
              })
              .catch((err) => {
                console.log("Error from database");
                console.log(err);
              });
          } else {
            Axios.patch(ynabURI, postData, {
              headers: { Authorization: "Bearer " + currAccToken },
            })
              .then((response) => {
                console.log("Added data to YNAB successfully!");
                // console.log(response);
                console.log(response.headers["x-rate-limit"]);
                let rateLim = response.headers["x-rate-limit"];
                let rateLimLeft = parseInt(
                  rateLim.substring(0, rateLim.indexOf("/"))
                );
                if (rateLimLeft >= 180) {
                  // console.log("What the heck do I get from this?");
                  // console.log(getNewTokens(currRefToken));
                  getNewTokens(currRefToken).then((data) => {
                    // console.log("What did I get for data?");
                    // console.log(data);

                    currAccToken = data[0];
                    currRefToken = data[1];
                  });
                  // let [newAccToken, newRefToken] = getNewTokens(currRefToken).PromiseResult;
                  // currAccToken = newAccToken;
                  // currRefToken = newRefToken;
                }
              })
              .catch((err) => {
                console.log("Error from YNAB");
                console.log(err);
              });
          }
        }
      }
    }
  };

  const getNewTokens = (refToken) => {
    // If we need a new access token, access the YNAB API to
    // request a new access token with the 'refreshToken' we were provided
    // the first time.
    return Axios.post("/api/ynab/get_access_token", {
      params: {
        client_id: ynab_config.CLIENT_ID,
        client_secret: ynab_config.CLIENT_SECRET,
        grant_type: "refresh_token",
        refresh_token: refToken,
      },
    })
      .then((response) => {
        console.log("Did I at least get a response from YNAB?");
        console.log(response);

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

        return {
          tokens: newTokens,
          expireSeconds: expireSeconds,
        };
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

        console.log("What about this down here?");
        console.log(data);
        console.log(data.tokens);
        console.log(data.tokens.accessToken);
        console.log(data.tokens.refreshToken);

        return [data.tokens.accessToken, data.tokens.refreshToken];
      })
      .catch((e) => {});
  };

  const toggleCategory = (catName, isExpanded) => {
    let newExpandList = [...expandedCategories];
    if (!isExpanded) {
      newExpandList.push(catName);
    } else {
      newExpandList = newExpandList.filter((x) => x !== catName);
    }

    setExpandedCategories(newExpandList);
  };

  if (!showSetup) {
    return (
      <div className="h-[600px] relative overflow-y-auto flex flex-col justify-center items-center">
        <div className="h-full flex flex-col items-center justify-center">
          <div className="text-5xl font-bold">Enter Starting Amount</div>
          <input
            className="mt-5 text-center border-b border-black text-4xl font-semibold text-green-500"
            type="numeric"
            value={"$" + startAmt}
            onChange={(e) => {
              setStartAmt(
                e.target.value?.replace("$", "") == "" ||
                  e.target.value == undefined
                  ? 0
                  : parseInt(e.target.value.replace("$", ""))
              );
            }}
            onFocus={(e) => {
              e.target.select();
            }}
          />
        </div>

        <button
          type="button"
          className="sticky bottom-0 mt-5 p-3 w-full rounded-md bg-gray-300 hover:bg-blue-500 hover:text-white font-bold"
          onClick={() => {
            setStartAmtStatic(startAmt);
            let newLocal = [];
            for (let i = 0; i < sixMonthDetails.categories.length; i++) {
              newLocal.push({ ...sixMonthDetails.categories[i] });
            }
            setSixMoLocal(newLocal);
            setShowSetup(true);
          }}
        >
          Continue
        </button>
      </div>
    );
  }

  console.log("Six month details on 'setup budget' modal");
  console.log(sixMonthDetails.categories);
  console.log(setupCategories);

  return (
    <div className="h-[800px] relative overflow-y-auto flex flex-col">
      {/* Amount Remaining Section */}
      <div className="text-center">
        <div className="text-4xl font-bold ">Amount Remaining</div>
        <div className="text-4xl font-bold text-green-500">
          {"$" + startAmt}
        </div>
      </div>

      {/* Category (table) w/ amounts */}
      <div className="flex flex-col my-2 h-[700px] overflow-y-auto border-2 border-black rounded-md">
        <table className="relative table-auto">
          <thead>
            <tr>
              <th className="sticky top-0 bg-white p-2"></th>
              <th className="text-left sticky top-0 bg-white p-2 text-lg">
                Category
              </th>
              <th className="text-right sticky top-0 bg-white p-2 text-lg">
                Add/Remove
              </th>
              <th className="text-center sticky top-0 bg-white p-2 text-lg">
                # of Months
              </th>
              <th className="text-center sticky top-0 bg-white p-2 text-lg">
                Total Amount
              </th>
            </tr>
          </thead>

          <tbody>
            {setupCategories.map((item, i) => {
              return (
                <SetupBudgetListItem
                  key={i}
                  isParent={item.isParent}
                  isExpanded={item.isExpanded}
                  category={item}
                  toggleCategory={toggleCategory}
                  addMonthToCategory={addMonthToCategory}
                  removeMonthFromCategory={removeMonthFromCategory}
                />
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Save to YNAB Button */}
      <button
        type="button"
        className="sticky bottom-0 mt-5 p-3 w-full rounded-md bg-gray-300 hover:bg-blue-500 hover:text-white font-bold"
        onClick={() => {
          // setShowSetup(true);
          saveToYNAB();
        }}
      >
        Save to YNAB
      </button>
    </div>
  );
}

export default SetupBudgetModal;
