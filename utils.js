export default function getCategoryAmountModified(cat) {
  //   console.log(
  //     'This is "getCategoryAmountModified"! I got called from utils.js'
  //   );
  if (cat.includeOnChart == 0) {
    return 0;
  }

  let newAmt = cat.categoryAmount;

  if (cat.expenseType && cat.expenseType == "By Date") {
    // Calculate the number of months from the update time to the expense date and add 1.
    // Then, divide the category amount by that number calculated above
    let dtExpDate = new Date(cat.expenseDate);
    let dtExpUpTm = new Date(cat.expenseUpdateTime);

    let yearsAhead =
      parseInt(dtExpDate.getFullYear()) - parseInt(dtExpUpTm.getFullYear());

    let monthsDifference =
      yearsAhead * 12 +
      (parseInt(dtExpDate.getMonth()) + 1) -
      (parseInt(dtExpUpTm.getMonth()) + 1);

    if (cat.numYearsPassed > 0 && monthsDifference !== 1) {
      monthsDifference -= 2;
    }

    newAmt /= monthsDifference;
  }

  return newAmt;
}
