import {
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { data } from "@go/models";
import { useState } from "react";

const Processess = ({ processes }: { processes: data.Process[] }) => {
  const [sortField, setSortField] = useState<string>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const sortedProcesses = [...processes].sort((a, b) => {
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

  return (
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
          {sortedProcesses.map((process, index) => (
            <Tr key={index}>
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
  );
};

export default Processess;
