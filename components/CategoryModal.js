function CategoryModal({ categories, addToList, closeModal }) {
  let isToggling = false;

  return (
    <div>
      <button onClick={closeModal}>close</button>
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
                <span className="cursor-pointer">
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
