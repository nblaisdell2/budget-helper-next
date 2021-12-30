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
