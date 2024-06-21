import { Box, Heading, Text } from "@chakra-ui/react";
import { data } from "@go/models";
import { FC, Fragment } from "react";
import { Chart } from "react-charts";

interface IRepoTechnologiesProps {
  technologies: data.RepoTechnologies[];
}

const RepoTechnologies: FC<IRepoTechnologiesProps> = ({ technologies }) => {
  if (technologies === undefined || technologies.length === 0) {
    return <Text>No Technologies</Text>;
  }
  return (
    <Fragment>
      <Box width="400px" height="400px">
        <Chart
          options={{
            primaryAxis: {
              getValue: (datum) => datum.count,
            },
            secondaryAxes: [
              {
                getValue: (datum) => datum.count,
                elementType: "bar",
              },
            ],
            data: technologies.map(({ count, technology }) => ({
              label: technology,
              data: [
                {
                  count,
                },
              ],
            })),
          }}
        />
      </Box>
    </Fragment>
  );
};

export default RepoTechnologies;
