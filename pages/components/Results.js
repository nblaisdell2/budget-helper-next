import ChartInfo from "./ChartInfo";
import ChartSection from "./ChartSection";

function Results({ name }) {
  return (
    <div>
      <div className="flex justify-center h-200">
        <ChartSection type={name} />
        <ChartInfo type={name} />
      </div>
    </div>
  );
}

export default Results;
