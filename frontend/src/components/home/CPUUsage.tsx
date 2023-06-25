import { Grid, GridItem, HStack, Progress, Text } from "@chakra-ui/react";
import { data } from "@go/models";
import colors from "@src/data/constants/colors";
import { BsCpu } from "react-icons/bs";

const CPUUsage = ({ cpuStats }: { cpuStats: data.CPUStats }) => {
  return (
    <>
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
                <Progress
                  width={100}
                  borderRadius={"md"}
                  colorScheme={colors[index]}
                  height="32px"
                  value={cpu}
                />
                <Text>{cpu.toFixed(2)}%</Text>
              </HStack>
            </GridItem>
          ))}
        </Grid>
      </HStack>
    </>
  );
};

export default CPUUsage;
