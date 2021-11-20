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
    let data = [["BillName", "Months Ahead", "Target"]];
    for (let i = 0; i < sixMonthDetails.categories.length; i++) {
      let currCat = sixMonthDetails.categories[i];
      console.log("adding to chart");
      console.log([
        currCat.name,
        currCat.monthsAhead,
        sixMonthDetails.monthsAheadTarget,
      ]);

      data.push([
        currCat.name,
        currCat.monthsAhead,
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
