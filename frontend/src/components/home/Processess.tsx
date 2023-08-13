import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Input,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import { KillProcess } from "@go/main/App";
import { data } from "@go/models";
import { Fragment, MutableRefObject, useRef, useState } from "react";

const Processess = ({ processes }: { processes: data.Process[] }) => {
  const [sortField, setSortField] = useState<string>("name");
  const [filteredProcesses, setFilteredProcesses] =
    useState<data.Process[]>(processes);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [activeProcess, setActiveProcess] = useState<data.Process>();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  const sortedProcesses = filteredProcesses.sort((a, b) => {
    if (!sortField) {
      return 0;
    }
    if (sortField === "name") {
      return sortDirection === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    }
    if (sortField === "memory") {
      return sortDirection === "asc"
        ? a.memoryUsage - b.memoryUsage
        : b.memoryUsage - a.memoryUsage;
    }
    if (sortField === "cpu") {
      return sortDirection === "asc"
        ? a.cpuUsage - b.cpuUsage
        : b.cpuUsage - a.cpuUsage;
    }
    return 0;
  });

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const killProcess = async (pid: number) => {
    await KillProcess(pid);

    onClose();
  };

  const handleClick = (process: data.Process) => {
    setActiveProcess(process);

    onOpen();
  };

  const handleSearch = (value: string) => {
    value = value.toLowerCase();
    setFilteredProcesses(
      processes.filter(
        (process) =>
          process.name.toLowerCase().includes(value) ||
          process.username.toLowerCase().includes(value) ||
          process.pid.toString().includes(value),
      ),
    );
  };

  return (
    <Fragment>
      <Input
        onChange={(event) => handleSearch(event.target.value)}
        placeholder="PID, Process, User"
      />
      <TableContainer>
        <Table variant="simple">
          <TableCaption>Processes</TableCaption>
          <Thead>
            <Tr>
              <Th onClick={() => handleSort("pid")}>Pid</Th>
              <Th onClick={() => handleSort("name")}>Process</Th>
              <Th onClick={() => handleSort("username")}>User</Th>
              <Th onClick={() => handleSort("memory")}>Memory</Th>
              <Th onClick={() => handleSort("cpu")}>CPU</Th>
            </Tr>
          </Thead>
          <Tbody>
            <AlertDialog
              isOpen={isOpen}
              leastDestructiveRef={cancelRef as MutableRefObject<any>}
              onClose={onClose}
            >
              <AlertDialogOverlay>
                <AlertDialogContent>
                  <AlertDialogHeader fontSize="lg" fontWeight="bold">
                    Kill Process "{activeProcess?.name} - {activeProcess?.pid}"
                  </AlertDialogHeader>

                  <AlertDialogBody>
                    Are you sure? You can't undo this action afterwards.
                  </AlertDialogBody>

                  <AlertDialogFooter>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button
                      colorScheme="red"
                      onClick={() => killProcess(activeProcess?.pid!)}
                      ml={3}
                    >
                      Kill
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialogOverlay>
            </AlertDialog>

            {sortedProcesses.map((process, index) => (
              <Tr
                onClick={() => handleClick(process)}
                _hover={{ bg: "gray.100" }}
                key={index}
              >
                <Td>{process.pid}</Td>
                <Td overflow={"scroll"} maxWidth={"50px"}>
                  {process.name}
                </Td>
                <Td>{process.username}</Td>
                <Td>{process.memoryUsage.toFixed(2)}%</Td>
                <Td>{process.cpuUsage.toFixed(2)}%</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Fragment>
  );
};

export default Processess;
