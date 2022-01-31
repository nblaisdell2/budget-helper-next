import { Chart } from "react-google-charts";

function SixMonthChart({ sixMonthDetails }) {
  console.log(sixMonthDetails);

  const options = {
    title: "",
    fontSize: 14,
    bold: true,
    legend: "none",
    bar: { groupWidth: "80%" },
    chartArea: { width: "80%", height: "95%" },
    axes: {
      x: {
        0: { side: "top", label: "White to move" }, // Top x-axis.
      },
    },
    backgroundColor: { fill: "transparent" },
    seriesType: "bars",
    series: {
      1: {
        type: "line",
        lineDashStyle: [8, 6],
      },
    },
    vAxis: {
      textStyle: {
        bold: true,
      },
    },
    hAxis: {
      viewWindow: {
        min: 0,
        max:
          sixMonthDetails.monthsAheadTarget > 12
            ? sixMonthDetails.monthsAheadTarget * 1.25
            : 12,
      },
    },
  };

  const chartData = () => {
    let data = [["BillName", "Months Ahead", { role: "style" }, "Target"]];
    // data.push(["", 0, "", sixMonthDetails.monthsAheadTarget]);

    for (let i = 0; i < sixMonthDetails.categories.length; i++) {
      let currCat = sixMonthDetails.categories[i];

      let barColor = "red";
      let percentMet = currCat.monthsAhead / sixMonthDetails.monthsAheadTarget;
      if (percentMet >= 0.3 && percentMet < 1) {
        barColor = "gold";
      } else if (percentMet >= 1) {
        barColor = "green";
      }

      if (currCat.monthsAhead <= 0) {
        barColor = "";
      }

      data.push([
        currCat.name,
        currCat.monthsAhead < 0 ? 0 : currCat.monthsAhead,
        barColor,
        sixMonthDetails.monthsAheadTarget,
      ]);
    }

    // data.push(["", 0, "", sixMonthDetails.monthsAheadTarget]);

    return data;
  };

  return (
    <>
      <div className="text-center font-bold  text-2xl mb-3">
        Regular Expenses
      </div>

      <div className="h-[550px] overflow-y-auto mt-10">
        {sixMonthDetails.categories.length == 0 ? (
          <div>
            <div className="text-center">
              Mark some Categories as a "Regular Expense" to track your progress
              on each of those categories.
            </div>
          </div>
        ) : (
          <Chart
            chartType="BarChart"
            data={chartData()}
            options={options}
            width="100%"
            height="1000px"
            legendToggle
          />
        )}
      </div>
    </>
  );
}

export default SixMonthChart;
