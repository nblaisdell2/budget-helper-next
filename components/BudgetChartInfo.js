import { useState, useEffect } from "react";
import { useUser } from "@auth0/nextjs-auth0";
import Axios from "axios";

import BudgetCategoryInfo from "./BudgetCategoryInfo";
import MyModal from "./MyModal";

import { getCategoryAmountModified, daysBetween } from "../utils";

import PencilAltIcon from "@heroicons/react/outline/PencilAltIcon";
import BudgetCategoryInfoListItem from "./BudgetCategoryInfoListItem";

function BudgetChartInfo({
  categories,
  setUserCategories,
  userCategoryList,
  setUserCategoryList,
  userDetails,
  setUserDetails,
  nextAutoRuns,
  setNextAutoRuns,
}) {
  const [ModalItem, setModalItem] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [changesMade, setChangesMade] = useState(false);
  const [removedCategories, setRemovedCategories] = useState([]);

  const { user, isLoading } = useUser();

  const addToList = (id, level, isChecked) => {
    let newCategories = { ...categories };

    if (level == "group") {
      let currGroup = newCategories.category_groups.find((x) => x.id == id);
      for (let i = 0; i < currGroup.categories.length; i++) {
        currGroup.categories[i].inUserList = isChecked;
        let existCat = userCategoryList
          .find((x) => x.id == currGroup.id)
          ?.categories.find((x) => x.id == currGroup.categories[i].id);
        if (existCat && !isChecked && !removedCategories.includes(existCat)) {
          let newRemCats = [...removedCategories];
          newRemCats.push({ ...existCat });
          setRemovedCategories(newRemCats);
        }
      }
    } else if (level == "category") {
      for (let i = 0; i < newCategories.category_groups.length; i++) {
        let foundCat = newCategories.category_groups[i].categories.find(
          (x) => x.id == id
        );
        if (foundCat !== null && foundCat !== undefined) {
          foundCat.inUserList = isChecked;
          let existCat = userCategoryList
            .find((x) => x.id == newCategories.category_groups[i].id)
            ?.categories.find((x) => x.id == foundCat.id);
          if (existCat && !isChecked && !removedCategories.includes(existCat)) {
            // removedCategories.push(foundCat);
            let newRemCats = [...removedCategories];
            newRemCats.push({ ...existCat });
            setRemovedCategories(newRemCats);
          }
        }
      }
    }

    setChangesMade(true);

    let userList = [];
    let currItemList = [];
    for (let i = 0; i < newCategories.category_groups.length; i++) {
      currItemList = [];
      for (
        let j = 0;
        j < newCategories.category_groups[i].categories.length;
        j++
      ) {
        if (newCategories.category_groups[i].categories[j].inUserList) {
          let existingCat = userCategoryList
            .find((x) => x.id == newCategories.category_groups[i].id)
            ?.categories.find(
              (x) => x.id == newCategories.category_groups[i].categories[j].id
            );
          if (existingCat) {
            currItemList.push({
              ...newCategories.category_groups[i].categories[j],
              categoryAmount: existingCat.categoryAmount,
              extraAmount: existingCat.extraAmount,
              expenseType: existingCat.expenseType,
              includeOnChart: existingCat.includeOnChart,
              upcomingExpense: existingCat.upcomingExpense,
              expenseDate: existingCat.expenseDate,
              expenseMonthsDivisor: existingCat.expenseMonthsDivisor,
              // expenseUpdateTime: existingCat.expenseUpdateTime,
              repeatFreqNum: existingCat.repeatFreqNum,
              repeatFreqType: existingCat.repeatFreqType,
              useCurrentMonth: existingCat.useCurrentMonth,
              toggleInclude: existingCat.toggleInclude,
              // numYearsPassed: existingCat.numYearsPassed,
            });
          } else {
            let newRemCats = [...removedCategories];
            let idx = newRemCats.indexOf(
              newRemCats.find(
                (x) => x.id == newCategories.category_groups[i].categories[j].id
              )
            );
            let rem = { ...newRemCats[idx] };

            if (Object.keys(rem).length > 0) {
              if (idx > -1) {
                newRemCats.splice(idx, 1);
              }
              setRemovedCategories(newRemCats);
              currItemList.push({
                ...newCategories.category_groups[i].categories[j],
                categoryAmount: rem.categoryAmount,
                extraAmount: rem.extraAmount,
                expenseType: rem.expenseType,
                includeOnChart: rem.includeOnChart,
                upcomingExpense: rem.upcomingExpense,
                expenseDate: rem.expenseDate,
                expenseMonthsDivisor: rem.expenseMonthsDivisor,
                // expenseUpdateTime: rem.expenseUpdateTime,
                repeatFreqNum: rem.repeatFreqNum,
                repeatFreqType: rem.repeatFreqType,
                useCurrentMonth: rem.useCurrentMonth,
                toggleInclude: rem.toggleInclude,
                // numYearsPassed: rem.numYearsPassed,
              });
            } else {
              currItemList.push({
                ...newCategories.category_groups[i].categories[j],
                categoryAmount: 0,
                extraAmount: 0,
                expenseType: null,
                includeOnChart: null,
                upcomingExpense: null,
                expenseDate: null,
                expenseMonthsDivisor: null,
                // expenseUpdateTime: null,
                repeatFreqNum: null,
                repeatFreqType: null,
                useCurrentMonth: 0,
                toggleInclude: 0,
                // numYearsPassed: 0,
              });
            }
          }
        }
      }

      if (currItemList.length > 0) {
        // let expanded = userCategoryList.find(
        //   (x) => x.id == newCategories.category_groups[i].id
        // )?.isExpanded;

        let cat = userCategoryList.find(
          (x) => x.id == newCategories.category_groups[i].id
        );
        userList.push({
          id: newCategories.category_groups[i].id,
          name: newCategories.category_groups[i].name,
          isExpanded: cat?.isExpanded,
          isSelected: cat?.isSelected,
          categories: currItemList,
        });
      }
    }

    setUserCategories(newCategories);
    setUserCategoryList(userList);

    if (userList !== undefined && userList !== null) {
      if (!user) {
        sessionStorage.setItem("userList", JSON.stringify(userList));
      }
    }
  };

  const _MS_PER_DAY = 1000 * 60 * 60 * 24;

  // a and b are javascript Date objects
  function dateDiffInDays(a, b) {
    // Discard the time and time-zone information.
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
  }

  const getNextAutoRunString = (nextRun) => {
    let dtNextRun = new Date(nextRun);
    let dtToday = new Date();

    let strNextRun = dtNextRun
      .toLocaleString()
      .replace(",", " @")
      .replace(":00:00", "");

    let numDays = daysBetween(dtToday, dtNextRun);
    if (numDays.toFixed(0) == 0) {
      strNextRun +=
        " (" + (dtToday.getHours() - dtNextRun.getHours()) + " hours)";
    } else {
      strNextRun += " (" + numDays.toFixed(0) + " days)";
    }

    return strNextRun;
  };

  const getCategoryListItems = () => {
    let listItems = [];
    for (let i = 0; i < userCategoryList.length; i++) {
      let currItem = userCategoryList[i];
      let groupTotalModified = currItem.categories.reduce((a, b) => {
        return a + getCategoryAmountModified(b);
      }, 0);

      listItems.push({
        key: currItem.id,
        id: currItem.id,
        category: currItem.name,
        amount: "$" + groupTotalModified.toFixed(0),
        amountNum: groupTotalModified,
        percentIncome:
          (userDetails.MonthlyAmount == 0
            ? 0
            : Math.round(
                (groupTotalModified / userDetails.MonthlyAmount) * 100
              )) + "%",
        isParent: true,
        isExpanded: currItem.isExpanded,
        fullCategory: null,
      });

      for (let j = 0; j < currItem.categories.length; j++) {
        let currCat = currItem.categories[j];
        let catAmtMod = getCategoryAmountModified(currCat);
        let showOther = currCat.categoryAmount !== catAmtMod;

        listItems.push({
          key: currCat.id,
          id: currCat.id,
          category: currCat.name,
          amount: showOther
            ? "$" +
              catAmtMod.toFixed(2) +
              " / ($" +
              currCat.categoryAmount +
              ")"
            : "$" + catAmtMod.toFixed(2),
          amountNum: showOther ? catAmtMod : currCat.categoryAmount,
          percentIncome:
            (userDetails.MonthlyAmount == 0
              ? 0
              : (catAmtMod / userDetails.MonthlyAmount) * 100
            ).toFixed(2) + "%",
          isParent: false,
          isExpanded: currItem.isExpanded,
          fullCategory: currCat,
        });
      }
    }
    return listItems;
  };

  useEffect(() => {
    if (!isLoading) {
      if (selectedCategory !== null) {
        let newList = [...userCategoryList];
        let newCat = newList
          .find((x) => x.id == selectedCategory.categoryGroupID)
          ?.categories.find((x) => x.id == selectedCategory.id);
        let catKeys = Object.keys(selectedCategory);
        for (let i = 0; i < catKeys.length; i++) {
          newCat[catKeys[i]] = selectedCategory[catKeys[i]];
        }

        setUserCategoryList(newList);

        delete selectedCategory.saveChanges;
      }
    }
  }, [selectedCategory, isLoading]);

  if (Object.keys(categories).length == 0) {
    return (
      <div className="h-full text-center flex flex-col justify-center">
        <div className="text-2xl">
          Please Connect to YNAB to get Category Details
        </div>
        <div className="text-lg mt-5">
          To connect, use the "Connect to YNAB" button in the top-right!
        </div>
      </div>
    );
  }

  if (selectedCategory) {
    return (
      <BudgetCategoryInfo
        category={selectedCategory}
        setCategory={setSelectedCategory}
        monthlyAmount={userDetails.MonthlyAmount}
        setChangesMade={setChangesMade}
      />
    );
  }

  let listItems = getCategoryListItems();

  return (
    <div>
      <div className="flex justify-between">
        <h1 className="font-bold text-2xl underline">Budget Categories</h1>

        {changesMade && (
          <div
            className="flex hover:underline"
            onClick={() => {
              Axios.post("/api/db/save_category_results", {
                UserID: userDetails.UserID,
                BudgetID: userDetails.DefaultBudgetID,
                CategoryDetails: JSON.stringify(userCategoryList),
              })
                .then((response) => {})
                .catch((err) => {});
              setChangesMade(false);
            }}
          >
            {user && (
              <>
                <PencilAltIcon className="h-6 cursor-pointer" />
                <h2 className="cursor-pointer">Save Changes</h2>
              </>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-col my-2 h-[500px] overflow-y-auto">
        <table className="relative table-auto">
          <thead>
            <tr>
              <th className="sticky top-0 bg-white p-2"></th>
              <th className="text-left sticky top-0 bg-white p-2 text-xl">
                Category
              </th>
              <th className="text-right sticky top-0 bg-white p-2 text-xl">
                Amount
              </th>
              <th className="text-center sticky top-0 bg-white p-2 text-xl">
                % of Income
              </th>
            </tr>
          </thead>

          <tbody>
            {listItems.map((item, i) => {
              return (
                <BudgetCategoryInfoListItem
                  key={item.key}
                  id={item.id}
                  category={item.category}
                  amount={item.amount}
                  percentIncome={item.percentIncome}
                  isParent={item.isParent}
                  isExpanded={item.isExpanded}
                  fullCategory={item.fullCategory}
                  setSelectedCategory={setSelectedCategory}
                  userCategoryList={userCategoryList}
                  setUserCategoryList={setUserCategoryList}
                />
              );
            })}
          </tbody>
        </table>
      </div>

      <hr />

      <div className="flex flex-row justify-between mt-3 items-center">
        <h2
          className="hover:underline cursor-pointer"
          onClick={() => setModalItem("Automation")}
        >
          {user &&
            (userDetails.NextAutomatedRun == null ? (
              <div>Automate?</div>
            ) : (
              <div>
                <div>Next Auto Run At</div>
                <div>{getNextAutoRunString(userDetails.NextAutomatedRun)}</div>
              </div>
            ))}
        </h2>
        <h2
          className="hover:underline cursor-pointer"
          onClick={() => setModalItem("Categories")}
        >
          Add YNAB Categories
        </h2>
      </div>

      <MyModal
        currModal={ModalItem}
        setCurrModal={setModalItem}
        categories={categories}
        addToList={addToList}
        userCategoryList={userCategoryList}
        userDetails={userDetails}
        setUserDetails={setUserDetails}
        nextAutoRuns={nextAutoRuns}
        setNextAutoRuns={setNextAutoRuns}
        listItems={listItems}
      />
    </div>
  );
}

export default BudgetChartInfo;
