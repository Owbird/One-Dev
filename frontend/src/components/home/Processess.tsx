import {
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
import { data } from "@go/models";

const Processess = ({ processes }: { processes: data.Process[] }) => {
  const header = ["name", "created", "actions"];
  const data = [
    {
      name: "Daggy",
      created: "7 days ago",
    },
    {
      name: "Anubra",
      created: "23 hours ago",
    },
    {
      name: "Josef",
      created: "A few seconds ago",
    },
    {
      name: "Sage",
      created: "A few hours ago",
    },
  ];
  const color1 = useColorModeValue("gray.400", "gray.400");
  const color2 = useColorModeValue("gray.400", "gray.400");
  return (
    <>
      {/* <HStack>
        {<BsCpu />}
        <Grid templateColumns="repeat(2, 1fr)" gap={6} maxH="3xl">
          {processes.map((process, index) => (
            <GridItem>
              <HStack>
                <Text>{process.name}</Text>
                <VStack>
                  <Progress
                    width={100}
                    borderRadius={"md"}
                    colorScheme={colors[index]}
                    height="32px"
                    value={process.cpuUsage}
                  />
                  <Progress
                    width={100}
                    borderRadius={"md"}
                    colorScheme={colors[index]}
                    height="32px"
                    value={process.memoyUsage}
                  />
                </VStack>
              </HStack>
            </GridItem>
          ))}
        </Grid>
      </HStack> */}

      <TableContainer>
        <Table variant="simple">
          <TableCaption>Processes</TableCaption>
          <Thead>
            <Tr>
              <Th>Pid</Th>
              <Th>Process</Th>
              <Th>User</Th>
              <Th>Memory</Th>
              <Th>CPU</Th>
            </Tr>
          </Thead>
          <Tbody>
            {processes.map((process, index) => (
              <Tr>
                <Td>{process.pid}</Td>

                <Td overflow={"scroll"} maxWidth={"50px"}>
                  {process.name}
                </Td>
                <Td>{process.username}</Td>
                <Td>{process.memoyUsage.toFixed(2)}</Td>
                <Td>{process.cpuUsage.toFixed(2)}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};

export default Processess;
