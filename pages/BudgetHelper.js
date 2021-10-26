import { useState } from "react";
import Widgets from "../components/Widgets";
import Results from "../components/Results";
function BudgetHelper() {
  const [widget, setWidget] = useState("Budget Chart");
  const changeWidget = (newWidget) => {
    console.log(newWidget);
    setWidget(newWidget);
  };

  return (
    <div>
      <Widgets name={widget} changeWidget={changeWidget} />
      <Results name={widget} changeWidget={changeWidget} />
    </div>
  );
}

export default BudgetHelper;
