export default function getCategoryAmountModified(cat) {
  if (cat.includeOnChart == 0) {
    return 0;
  }

  let newAmt = cat.categoryAmount;

  if (cat.expenseType && cat.expenseType == "By Date") {
    newAmt /= cat.expenseMonthsDivisor;
  }

  return newAmt;
}
