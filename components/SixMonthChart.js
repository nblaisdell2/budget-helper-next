import { Chart } from "react-google-charts";

function SixMonthChart({ sixMonthDetails }) {
  const options = {
    title: "Six Month Details",
    legend: "bottom",
    seriesType: "bars",
    series: {
      1: {
        type: "line",
        lineDashStyle: [8, 6],
      },
    },
    vAxis: {
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
    data.push(["", 0, "", sixMonthDetails.monthsAheadTarget]);

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

    data.push(["", 0, "", sixMonthDetails.monthsAheadTarget]);

    return data;
  };

  return (
    <div>
      <Chart
        chartType="ComboChart"
        data={chartData()}
        options={options}
        width="100%"
        height="400px"
        legendToggle
      />
    </div>
  );
}

export default SixMonthChart;
