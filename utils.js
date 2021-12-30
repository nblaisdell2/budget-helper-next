export function getCategoryAmountModified(cat) {
  if (cat.includeOnChart == 0) {
    return 0;
  }

  let newAmt = cat.categoryAmount;

  if (cat.expenseType && cat.expenseType == "By Date") {
    newAmt /= cat.expenseMonthsDivisor;
  }

  return newAmt;
}

export function getAmountByFrequency(amt, freq) {
  if (freq == "One-Time" || freq == "Monthly") {
    return amt;
  } else if (freq == "Every 2 Weeks") {
    return amt / 2;
  } else if (freq == "Every Week") {
    return amt / 4;
  }
}

function treatAsUTC(date) {
  var result = new Date(date);
  result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
  return result;
}

export function daysBetween(startDate, endDate) {
  var millisecondsPerDay = 24 * 60 * 60 * 1000;
  return (treatAsUTC(endDate) - treatAsUTC(startDate)) / millisecondsPerDay;
}

var mthDetails = {};
export function setMonthDetails(monthDetails) {
  mthDetails = monthDetails;
}

export function getLatestBalance(catID) {
  if (mthDetails && mthDetails.length > 0) {
    console.log("catid?");
    console.log(catID);
    console.log(mthDetails);

    let ynabCat = mthDetails[0]?.categories.find((x) => x.id == catID);
    return ynabCat["balance"] == 0 ? 0 : ynabCat["balance"] / 1000;
  }
  return 0;
}

export function getSixMonthTargetMetCount(categories, monthsAheadTarget) {
  let targetMetCount = 0;

  for (let i = 0; i < categories.length; i++) {
    let currCat = categories[i];
    currCat.monthsAhead = 0;

    if (mthDetails.length > 0) {
      let monthCat = null;
      if (currCat.categoryAmount > 0) {
        if (currCat.expenseType == "Monthly") {
          monthCat = mthDetails[0].categories.find(
            (x) =>
              x.category_group_id == currCat.categoryGroupID &&
              x.id == currCat.id
          );
          currCat.monthsAhead =
            Math.floor(monthCat.balance / 1000 / currCat.categoryAmount) - 1;
        } else {
          for (let j = mthDetails.length - 2; j >= 0; j--) {
            monthCat = mthDetails[j].categories.find(
              (x) =>
                x.category_group_id == currCat.categoryGroupID &&
                x.id == currCat.id
            );

            let catAmt = currCat.categoryAmount / currCat.expenseMonthsDivisor;
            // if (currCat.repeatFreqType == "Years") {
            //   catAmt /= currCat.repeatFreqNum * 12;
            // } else {
            //   catAmt /= currCat.repeatFreqNum;
            // }

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
  }

  return targetMetCount;
}

export function getShortDate(dt) {
  let newDate = dt;

  // newDate.setDate(newDate.getDate() + 21);

  return (
    ("0" + (newDate.getMonth() + 1)).slice(-2) +
    "/" +
    ("0" + newDate.getDate()).slice(-2) +
    "/" +
    newDate.getFullYear()
  );
}

export function merge(obj, fieldName) {
  let subArrays = obj.map((x) => x[fieldName]);
  return subArrays.reduce((a, b) => {
    return a.concat(b);
  }, []);
}

export function getAllCategories(userCategoryList) {
  return merge(userCategoryList, "categories");
}

export function calculateUpcomingExpensesForCategory(
  cat,
  dayOfWeek,
  dayOfMonth,
  payFreq,
  extraAmt = 0
) {
  let ynabLatestBalance = getLatestBalance(cat.id);
  console.log("YNAB - Latest balance for " + cat.name);
  console.log(ynabLatestBalance);

  let dtWithTime = new Date();
  dtWithTime.setHours(0, 0, 0, 0);

  if (payFreq == "Every Week" || payFreq == "Every 2 Weeks") {
    let weekNum = 0;
    switch (dayOfWeek) {
      case "Sun":
        weekNum = 0;
        break;
      case "Mon":
        weekNum = 1;
        break;
      case "Tue":
        weekNum = 2;
        break;
      case "Wed":
        weekNum = 3;
        break;
      case "Thu":
        weekNum = 4;
        break;
      case "Fri":
        weekNum = 5;
        break;
      case "Sat":
        weekNum = 6;
        break;
      default:
        break;
    }

    let daysToAdd = weekNum - dtWithTime.getDay();
    if (daysToAdd < 0) {
      daysToAdd += 7;
    } else if (daysToAdd == 0 && dtWithTime < new Date()) {
      daysToAdd += 7;
    }

    dtWithTime = new Date(dtWithTime.setDate(dtWithTime.getDate() + daysToAdd));
  } else if (payFreq == "Monthly") {
    let dtTemp = new Date();
    if (dtTemp.getDate() > dayOfMonth) {
      dtTemp = new Date(dtTemp.setMonth(dtTemp.getMonth() + 1));
      dtTemp = new Date(dtTemp.setDate(dayOfMonth));
    } else {
      dtTemp = new Date(dtTemp.setDate(dayOfMonth));
    }
    dtWithTime = dtTemp;
    dtWithTime.setHours(0, 0, 0, 0);
  }

  let totalPurchaseAmt = cat.upcomingExpense - ynabLatestBalance;
  let amtPerPaycheck = getAmountByFrequency(cat.categoryAmount, payFreq);

  let newAutoRunList = [];
  do {
    totalPurchaseAmt -= amtPerPaycheck + extraAmt;

    newAutoRunList.push({
      RunTime: dtWithTime.toISOString(),
      Frequency: payFreq,
      AmtPerPaycheck: amtPerPaycheck,
      TotalAmt: totalPurchaseAmt,
    });

    let dtTemp = new Date(dtWithTime);
    switch (payFreq) {
      case "Every Week":
        dtTemp = new Date(dtTemp.setDate(dtTemp.getDate() + 7));
        break;
      case "Every 2 Weeks":
        dtTemp = new Date(dtTemp.setDate(dtTemp.getDate() + 14));
        break;
      case "Monthly":
        dtTemp = new Date(dtTemp.setMonth(dtTemp.getMonth() + 1));
        break;
      default:
        break;
    }

    dtWithTime = dtTemp;
  } while (totalPurchaseAmt > 0);

  console.log("Auto run list for paying off expense");
  console.log(newAutoRunList);

  let dtPurchaseDate = new Date(
    newAutoRunList[newAutoRunList.length - 1].RunTime
  );
  let numPaychecks = newAutoRunList.length;
  let numDaysToPurchase = daysBetween(new Date(), dtPurchaseDate);

  return {
    ItemID: cat.id,
    ItemGroupID: cat.categoryGroupID,
    ItemName: cat.name,
    ItemAmount:
      "$" +
      ynabLatestBalance.toFixed(0) +
      " / $" +
      cat.upcomingExpense.toFixed(0),
    ItemDate: getShortDate(
      new Date(newAutoRunList[newAutoRunList.length - 1].RunTime)
    ),
    // ItemDate: new Date(
    //   newAutoRunList[newAutoRunList.length - 1].RunTime
    // ).toLocaleDateString("en-US"),
    NumDays: Math.ceil(numDaysToPurchase).toFixed(0),
    NumPaychecks: numPaychecks,
  };
}

export function calculateUpcomingExpenses(
  userCategoryList,
  dayOfWeek,
  dayOfMonth,
  payFreq,
  extraAmt = 0
) {
  let upcomingTemp = [];
  let potential = getAllCategories(userCategoryList).filter(
    (x) => x.upcomingExpense !== null && x.categoryAmount > 0
  );

  for (let i = 0; i < potential.length; i++) {
    upcomingTemp.push(
      calculateUpcomingExpensesForCategory(
        potential[i],
        dayOfWeek,
        dayOfMonth,
        payFreq,
        extraAmt
      )
    );
  }

  console.log("upcoming expenses - BEFORE?");
  console.log(upcomingTemp);

  upcomingTemp.sort((a, b) =>
    parseInt(a.NumDays) > parseInt(b.NumDays) ? 1 : -1
  );

  console.log("upcoming expenses - sorted?");
  console.log(upcomingTemp);

  return upcomingTemp;
}
