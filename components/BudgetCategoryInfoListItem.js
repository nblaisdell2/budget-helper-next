import ChevronDownIcon from "@heroicons/react/outline/ChevronDownIcon";
import ChevronRightIcon from "@heroicons/react/outline/ChevronRightIcon";

function BudgetCategoryInfoListItem({
  id,
  category,
  amount,
  percentIncome,
  isParent,
  isExpanded,
  fullCategory,
  setSelectedCategory,
  userCategoryList,
  setUserCategoryList,
}) {
  return isParent ? (
    <tr
      className="cursor-pointer hover:bg-gray-200"
      onClick={() => {
        let newList = [...userCategoryList];
        let expandGroup = newList.find((x) => x.id == id);
        expandGroup.isExpanded = !isExpanded;
        setUserCategoryList(newList);
      }}
    >
      <td>
        {isExpanded ? (
          <ChevronDownIcon className="h-6 inline" />
        ) : (
          <ChevronRightIcon className="h-6 inline" />
        )}
      </td>
      <td>
        <span className="cursor-pointer font-bold">{category}</span>
      </td>
      <td className="text-right font-bold">
        <span className="mr-1">{amount}</span>
      </td>
      <td className="text-right font-bold">
        <span className="mr-10">{percentIncome}</span>
      </td>
    </tr>
  ) : (
    isExpanded && (
      <tr
        className="cursor-pointer hover:bg-gray-300"
        onClick={() => {
          setSelectedCategory(fullCategory);
        }}
      >
        <td></td>
        <td>
          <span className="ml-4 cursor-pointer">{category}</span>
        </td>
        <td className="text-right">
          <span className="mr-1">{amount}</span>
        </td>
        <td className="text-right">
          <span className="mr-10">{percentIncome}</span>
        </td>
      </tr>
    )
  );
}

export default BudgetCategoryInfoListItem;
