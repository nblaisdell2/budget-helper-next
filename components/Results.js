import ChartInfo from "./ChartInfo";
import ChartSection from "./ChartSection";
import { useUser } from "@auth0/nextjs-auth0";

function Results({
  name,
  changeWidget,
  sixMonthDetails,
  setSixMonthDetails,
  categories,
  setUserCategories,
  userCategoryList,
  setUserCategoryList,
  userDetails,
  setUserDetails,
  nextAutoRuns,
  setNextAutoRuns,
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
          sixMonthDetails={sixMonthDetails}
          setSixMonthDetails={setSixMonthDetails}
          categories={categories}
          userDetails={userDetails}
          setUserDetails={setUserDetails}
          userCategoryList={userCategoryList}
        />
        <ChartInfo
          type={name}
          sixMonthDetails={sixMonthDetails}
          setSixMonthDetails={setSixMonthDetails}
          categories={categories}
          setUserCategories={setUserCategories}
          userCategoryList={userCategoryList}
          setUserCategoryList={setUserCategoryList}
          userDetails={userDetails}
          setUserDetails={setUserDetails}
          nextAutoRuns={nextAutoRuns}
          setNextAutoRuns={setNextAutoRuns}
        />
      </div>
    </div>
  );
}

export default Results;
