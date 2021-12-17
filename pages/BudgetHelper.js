import { useState, useEffect } from "react";
import Widgets from "../components/Widgets";
import Results from "../components/Results";
import { useUser } from "@auth0/nextjs-auth0";

function BudgetHelper({
  categories,
  sixMonthDetails,
  setUserCategories,
  userCategoryList,
  setUserCategoryList,
  userDetails,
  setUserDetails,
}) {
  const [widget, setWidget] = useState("Budget Chart");

  const { user, isLoading } = useUser();

  const changeWidget = (newWidget) => {
    setWidget(newWidget);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Widgets name={widget} changeWidget={changeWidget} />
      <Results
        name={widget}
        changeWidget={changeWidget}
        categories={categories}
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

export default BudgetHelper;
