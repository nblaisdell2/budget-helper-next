import Image from "next/image";

function CategoryModal({ categories, addToList }) {
  let isToggling = false;

  return (
    <div>
      <div className="flex justify-around">
        <div>
          <Image src="/ynab_logo.png" height="100px" width="100px" />
        </div>
        <div className="ml-10 flex-grow">
          <div className="font-bold text-lg text-center">YNAB Categories</div>
          <ul className="text-sm list-disc">
            <li>Here is a list of the categories in your YNAB Budget.</li>
            <li>
              Add/Remove them here, and then adjust the amounts per category on
              the Budget Helper chart!
            </li>
          </ul>
        </div>
      </div>

      <hr />

      <div className="flex flex-col m-5 h-[500px] overflow-y-auto">
        <ul>
          {categories.category_groups.map((item, i) => {
            let isChecked = false;
            let isDeterminate = false;

            let numInUserList = item.categories.filter(
              (x) => x.inUserList
            ).length;

            if (numInUserList > 0) {
              if (numInUserList == item.categories.length) {
                isChecked = true;
              } else {
                isDeterminate = true;
              }
            }

            return (
              <li
                key={item.id}
                onClick={() => {
                  if (isToggling) {
                    isToggling = false;
                  } else {
                    addToList(item.id, "group", isDeterminate || !isChecked);
                  }
                }}
              >
                <input
                  type="checkbox"
                  ref={(input) => {
                    if (input) {
                      input.indeterminate = isDeterminate;
                    }
                  }}
                  checked={isChecked}
                  onChange={() => {}}
                />
                <span className="cursor-pointer font-bold">
                  {"  "}
                  {item.name}
                </span>
                <ul>
                  {item.categories.map((itemc, ci) => {
                    return (
                      <li
                        className="ml-10 cursor-pointer"
                        key={itemc.id}
                        onClick={() => {
                          isToggling = true;
                          addToList(itemc.id, "category", !itemc.inUserList);
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={itemc.inUserList}
                          onChange={() => {}}
                        />
                        {"  "}
                        <span>{itemc.name}</span>
                      </li>
                    );
                  })}
                </ul>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default CategoryModal;
