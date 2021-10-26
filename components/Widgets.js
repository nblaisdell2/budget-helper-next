function Widgets({ name, changeWidget }) {
  const widgetItem = (name, selected) => {
    return (
      <button
        onClick={() => changeWidget(name)}
        className={`font-bold p-3 rounded-md hover:underline ${
          selected
            ? "bg-blue-400 text-white"
            : "hover:bg-blue-300 hover:text-white"
        }`}
      >
        {name}
      </button>
    );
  };
  return (
    <div className="flex justify-center space-x-20 text-2xl my-5">
      {widgetItem("Budget Chart", name === "Budget Chart")}
      {widgetItem("Six Month Details", name === "Six Month Details")}
      {widgetItem("Upcoming Expenses", name === "Upcoming Expenses")}
    </div>
  );
}

export default Widgets;
