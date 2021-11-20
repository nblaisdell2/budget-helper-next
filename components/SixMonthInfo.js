import PencilAltIcon from "@heroicons/react/outline/PencilAltIcon";

function SixMonthInfo({ sixMonthDetails }) {
  console.log("six month category list");
  console.log(sixMonthDetails);
  console.log(
    sixMonthDetails.targetMetCount / sixMonthDetails.categories.length
  );

  return (
    <div className="flex flex-col justify-around items-center h-full">
      <div className="font-bold text-5xl underline">Six Month Info</div>

      <div className="mt-10 flex flex-col items-center">
        <div className="text-3xl font-bold">Months Ahead Target</div>
        <div className="flex justify-evenly items-center">
          <div className="text-3xl mr-3">
            {sixMonthDetails.monthsAheadTarget}
          </div>
          <div>
            <PencilAltIcon className="h-8 cursor-pointer" />
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-col items-center">
        <div className="text-3xl font-bold">Categories w/ Target Met</div>
        <div className="text-3xl">
          {sixMonthDetails.targetMetCount +
            " / " +
            sixMonthDetails.categories.length +
            " (" +
            (
              (sixMonthDetails.targetMetCount /
                sixMonthDetails.categories.length) *
              100
            ).toFixed(0) +
            "%)"}
        </div>
      </div>
    </div>
  );
}

export default SixMonthInfo;
