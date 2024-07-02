import { Box, Heading, Text } from "@chakra-ui/react";
import { data } from "@go/models";
import { FC, Fragment } from "react";
import { Chart } from "react-charts";

interface IRepoTechnologiesProps {
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

const RepoContributedDays: FC<IRepoTechnologiesProps> = ({ days }) => {
  return (
    <Fragment>
      <Box width="400px" height="400px">
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
      </Box>
    </Fragment>
  );
};

export default RepoContributedDays;
