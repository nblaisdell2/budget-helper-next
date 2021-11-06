import { useState, useEffect } from "react";
import Modal from "react-modal";
import { useUser } from "@auth0/nextjs-auth0";
import Axios from "axios";

import BudgetCategoryInfo from "./BudgetCategoryInfo";
import CategoryModal from "./CategoryModal";

import ChevronDownIcon from "@heroicons/react/outline/ChevronDownIcon";
import ChevronRightIcon from "@heroicons/react/outline/ChevronRightIcon";
import PencilAltIcon from "@heroicons/react/outline/PencilAltIcon";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "70%",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

Modal.setAppElement("#__next");
Modal.defaultStyles.overlay.backgroundColor = "rgba(0, 0, 0, 0.7)";

function BudgetChartInfo({
  categories,
  setUserCategories,
  userCategoryList,
  setUserCategoryList,
  userDetails,
}) {
  const [modalIsOpen, setIsOpen] = useState(false);
  const openModal = () => {
    setIsOpen(true);
  };
  const afterOpenModal = () => {
    // references are now sync'd and can be accessed.
  };
  const closeModal = () => {
    setIsOpen(false);
  };

  const { user, isLoading } = useUser();

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [changesMade, setChangesMade] = useState(false);

  const [removedCategories, setRemovedCategories] = useState([]);

  const addToList = (id, level, isChecked) => {
    let newCategories = { ...categories };

    if (level == "group") {
      console.log("Adding items to userList - GROUP");
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
          console.log("removed category and added to list");
          console.log(newRemCats);
        }
      }
    } else if (level == "category") {
      console.log("Adding items to userList - CATEGORY");
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
            console.log("removed category and added to list");
            console.log(newRemCats);
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
            // console.log("FOUND EXISTING!");
            // console.log("  GroupID: " + newCategories.category_groups[i].id);
            // console.log(
            //   "  CatID  : " + newCategories.category_groups[i].categories[j].id
            // );
            // console.log(existingCat);

            currItemList.push({
              ...newCategories.category_groups[i].categories[j],
              categoryAmount: existingCat.categoryAmount,
              expenseType: existingCat.expenseType,
              includeOnChart: existingCat.includeOnChart,
              upcomingExpense: existingCat.upcomingExpense,
            });
          } else {
            console.log("new one here");
            console.log("removed categories");
            console.log(removedCategories);

            let newRemCats = [...removedCategories];
            let idx = newRemCats.indexOf(
              newRemCats.find(
                (x) => x.id == newCategories.category_groups[i].categories[j].id
              )
            );
            let rem = { ...newRemCats[idx] };

            if (Object.keys(rem).length > 0) {
              console.log("what is rem?");
              console.log(rem);
              console.log("we have a removed one here!");
              if (idx > -1) {
                newRemCats.splice(idx, 1);
              }
              setRemovedCategories(newRemCats);
              console.log("new removed list");
              console.log(newRemCats);
              currItemList.push({
                ...newCategories.category_groups[i].categories[j],
                categoryAmount: rem.categoryAmount,
                expenseType: rem.expenseType,
                includeOnChart: rem.includeOnChart,
                upcomingExpense: rem.upcomingExpense,
              });
            } else {
              currItemList.push({
                ...newCategories.category_groups[i].categories[j],
                categoryAmount: 0,
                expenseType: null,
                includeOnChart: null,
                upcomingExpense: null,
              });
            }
          }
        }
      }

      if (currItemList.length > 0) {
        let expanded = userCategoryList.find(
          (x) => x.id == newCategories.category_groups[i].id
        )?.isExpanded;

        userList.push({
          id: newCategories.category_groups[i].id,
          name: newCategories.category_groups[i].name,
          isExpanded: expanded,
          categories: currItemList,
        });
      }
    }

    console.log("new user list");
    console.log(userList);

    setUserCategories(newCategories);
    setUserCategoryList(userList);

    if (userList !== undefined && userList !== null) {
      if (!user) {
        sessionStorage.setItem("userList", JSON.stringify(userList));
      }

      // Note: Instead of saving every time there's a change to the list of categories,
      //       we'll use a save button on the whole page. That way, people can make changes,
      //       (add/remove/update info) to experiment with the budget without having to remember
      //       what to change things back to.
      // else {
      //   // save results to DB
      //   console.log("Should save category results to Database!");
      //   Axios.post("/api/db/save_category_results", {
      //     UserID: userDetails.UserID,
      //     BudgetID: userDetails.DefaultBudgetID,
      //     CategoryDetails: JSON.stringify(userList),
      //   })
      //     .then((response) => {
      //       console.log("Category Details save to database!");
      //       console.log(response);
      //     })
      //     .catch((err) => {
      //       console.log(err);
      //     });
      // }
    }
  };

  useEffect(() => {
    if (!isLoading) {
      if (selectedCategory !== null) {
        console.log("updating selected category");
        console.log(selectedCategory);
        let newList = [...userCategoryList];
        let newCat = newList
          .find((x) => x.id == selectedCategory.categoryGroupID)
          ?.categories.find((x) => x.id == selectedCategory.id);
        // console.log("newCat");
        // console.log(newCat);
        newCat.categoryAmount = selectedCategory.categoryAmount;
        newCat.expenseType = selectedCategory.expenseType;
        newCat.includeOnChart = selectedCategory.includeOnChart;
        newCat.upcomingExpense = selectedCategory.upcomingExpense;

        // console.log("newCat - after");
        // console.log(newCat);
        // newCat = { ...selectedCategory };
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

  // console.log("YNAB Categories");
  // console.log(categories);

  console.log("User-List Categories");
  console.log(userCategoryList);

  console.log("Monthly Income");
  console.log(userDetails.MonthlyAmount);

  return (
    <div>
      <div className="flex justify-between">
        <h1 className="font-bold text-2xl underline">Budget Categories</h1>

        {changesMade && (
          <div
            className="flex hover:underline"
            onClick={() => {
              // let newCat = getNewCategory("saveChanges", true);
              console.log("about to save userList!");
              console.log(userCategoryList);

              console.log(
                "what are the user details when saving my categories?"
              );
              console.log(userDetails);

              Axios.post("/api/db/save_category_results", {
                UserID: userDetails.UserID,
                BudgetID: userDetails.DefaultBudgetID,
                CategoryDetails: JSON.stringify(userCategoryList),
              })
                .then((response) => {
                  console.log("Category Details save to database!");
                  console.log(response);
                })
                .catch((err) => {
                  console.log(err);
                });
              setChangesMade(false);
              // setCategory(newCat);
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
          </thead>

          <tbody>
            {userCategoryList.map((item, i) => {
              let groupTotal = item.categories.reduce((a, b) => {
                return a + b.categoryAmount;
              }, 0);

              return (
                <>
                  <tr
                    key={item.id}
                    className="cursor-pointer hover:bg-gray-200"
                    onClick={() => {
                      let newList = [...userCategoryList];

                      let expandGroup = newList.find((x) => x.id == item.id);
                      expandGroup.isExpanded = !item.isExpanded;
                      setUserCategoryList(newList);
                    }}
                  >
                    <td>
                      {item.isExpanded ? (
                        <ChevronDownIcon className="h-6 inline" />
                      ) : (
                        <ChevronRightIcon className="h-6 inline" />
                      )}
                    </td>
                    <td>
                      <span className="cursor-pointer font-bold">
                        {item.name}
                      </span>
                    </td>
                    <td className="text-right font-bold">
                      <span className="mr-1">{"$" + groupTotal}</span>
                    </td>
                    <td className="text-right font-bold">
                      <span className="mr-10">
                        {Math.round(
                          (groupTotal / userDetails.MonthlyAmount) * 100
                        ) + "%"}
                      </span>
                    </td>
                  </tr>

                  <>
                    {item.isExpanded &&
                      item.categories.map((itemc, ci) => {
                        return (
                          <tr
                            key={itemc.id}
                            className="cursor-pointer hover:bg-gray-300"
                            onClick={() => setSelectedCategory(itemc)}
                          >
                            <td></td>
                            <td>
                              <span className="ml-4 cursor-pointer">
                                {itemc.name}
                              </span>
                            </td>
                            <td className="text-right">
                              <span className="mr-1">
                                {"$" + itemc.categoryAmount}
                              </span>
                            </td>
                            <td className="text-right">
                              <span className="mr-10">
                                {(
                                  (itemc.categoryAmount /
                                    userDetails.MonthlyAmount) *
                                  100
                                ).toFixed(2) + "%"}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                  </>
                </>
              );
            })}
          </tbody>
        </table>
      </div>

      <hr />

      <div className="flex flex-row justify-between mt-5">
        <h2>Automate?</h2>
        <h2
          className="hover:underline cursor-pointer"
          onClick={() => openModal()}
        >
          Add YNAB Categories
        </h2>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <CategoryModal
          categories={categories}
          closeModal={closeModal}
          addToList={addToList}
        />
      </Modal>
    </div>
  );
}

export default BudgetChartInfo;
