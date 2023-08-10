import { Grid, GridItem, HStack, Text } from "@chakra-ui/react";
import { data } from "@go/models";
import { colors } from "@src/data/constants";
import { Fragment } from "react";
import { BsCpu } from "react-icons/bs";
import StatProgressBar from "./HomeProgress";

const CPUUsage = ({ cpuStats }: { cpuStats: data.CPUStats }) => {
  return (
    <Fragment>
      <Text>
        CPU: {cpuStats.model} | {cpuStats.cores} cores
      </Text>
      <HStack>
        {<BsCpu />}
        <Grid templateColumns="repeat(2, 1fr)" gap={6} maxH="3xl">
          {cpuStats.usages.map((cpu, index) => (
            <GridItem key={index}>
              <HStack>
                <Text>{index + 1}</Text>

                <StatProgressBar colorScheme={colors[index]} value={cpu} />
                <Text>{cpu.toFixed(2)}%</Text>
              </HStack>
            </GridItem>
          ))}
        </Grid>
      </HStack>
    </Fragment>
  );
};

export default CPUUsage;
