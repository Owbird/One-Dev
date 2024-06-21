import { Box, Heading, Text } from "@chakra-ui/react";
import { data } from "@go/models";
import { FC, Fragment } from "react";
import { AxisOptions, Chart } from "react-charts";

interface IRepoContributorsProps {
  contributors: data.RepoContributors[];
}

const RepoContributors: FC<IRepoContributorsProps> = ({ contributors }) => {
  if (contributors === undefined || contributors.length === 0) {
    return <Text>No Contributors</Text>;
  }

  return (
    <Fragment>
      <Box width="400px" height="400px">
        <Chart
          options={{
            interactionMode: "closest",
            getDatumStyle: (datum) =>
              ({
                circle: { r: parseInt(datum.originalDatum.percentage) },
              }) as any,
            primaryAxis: {
              getValue: (datum) => `${datum.percentage}%`,
            },
            secondaryAxes: [
              {
                getValue: (datum) => datum.totalCommits,
                elementType: "bubble",
              },
            ],
            data: contributors.map(
              ({ totalCommits, percentage, contributor }) => ({
                label: contributor,
                data: [
                  {
                    totalCommits,
                    percentage,
                  },
                ],
              }),
            ),
          }}
        />
      </Box>
    </Fragment>
  );
};

export default RepoContributors;
