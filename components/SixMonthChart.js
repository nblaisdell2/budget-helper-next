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
        max: 12,
      },
    },
  };

  const chartData = () => {
    let data = [["BillName", "Months Ahead", { role: "style" }, "Target"]];
    for (let i = 0; i < sixMonthDetails.categories.length; i++) {
      let currCat = sixMonthDetails.categories[i];
      console.log("adding to chart");
      console.log([
        currCat.name,
        currCat.monthsAhead,
        sixMonthDetails.monthsAheadTarget,
      ]);

      let barColor = "red";
      if (currCat.monthsAhead >= 3 && currCat.monthsAhead <= 5) {
        barColor = "gold";
      } else if (currCat.monthsAhead >= 6) {
        barColor = "green";
      }

      data.push([
        currCat.name,
        currCat.monthsAhead < 0 ? 0 : currCat.monthsAhead,
        barColor,
        sixMonthDetails.monthsAheadTarget,
      ]);
    }
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
