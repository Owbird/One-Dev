import { data } from "@go/models";
import { FC, Fragment } from "react";
import { Chart } from "react-charts";

interface IRepoContributedDaysProps {
  days: data.RepoAnalytics["contributedDays"];
}

const dayIndices: Record<number, string> = {
  0: "Sun",
  1: "Mon",
  2: "Tues",
  3: "Wed",
  4: "Thurs",
  5: "Fri",
  6: "Sat",
};

const RepoContributedDays: FC<IRepoContributedDaysProps> = ({ days }) => {
  return (
    <Fragment>
      <div className="w-96 h-96">
        <Chart
          options={{
            primaryAxis: {
              getValue: (datum) => datum.day,
            },
            secondaryAxes: [
              {
                getValue: (datum) => datum.count,
                elementType: "bar",
              },
            ],
            data: Object.keys(days).map((day) => ({
              label: dayIndices[parseInt(day)],
              data: [
                {
                  day: dayIndices[parseInt(day)],
                  count: days[parseInt(day)],
                },
              ],
            })),
          }}
        />
      </div>
    </Fragment>
  );
};

export default RepoContributedDays;
