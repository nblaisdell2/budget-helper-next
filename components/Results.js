import ChartInfo from "./ChartInfo";
import ChartSection from "./ChartSection";
import { useUser } from "@auth0/nextjs-auth0";

function Results({
  name,
  changeWidget,
  categories,
  sixMonthDetails,
  setUserCategories,
  userCategoryList,
  setUserCategoryList,
  userDetails,
  setUserDetails,
}) {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex min-h-full max-h-[650px]">
        <ChartSection
          type={name}
          categories={categories}
          sixMonthDetails={sixMonthDetails}
          userDetails={userDetails}
          setUserDetails={setUserDetails}
          userCategoryList={userCategoryList}
        />
        <ChartInfo
          type={name}
          categories={categories}
          sixMonthDetails={sixMonthDetails}
          setUserCategories={setUserCategories}
          userCategoryList={userCategoryList}
          setUserCategoryList={setUserCategoryList}
          userDetails={userDetails}
          setUserDetails={setUserDetails}
        />
      </div>
    </div>
  );
}

export default Results;
