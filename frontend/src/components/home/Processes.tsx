import {
  Fragment,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { GetSystemProcesses, KillProcess } from "@go/main/App";
import { data } from "@go/models";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Input } from "../ui/input";

type SortField = "pid" | "name" | "username" | "memory" | "cpu";
type SortDirection = "asc" | "desc";

const Processes = () => {
  const [processes, setProcesses] = useState<data.Process[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [activeProcess, setActiveProcess] = useState<data.Process | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getProcesses = useCallback(async () => {
    const _processes = await GetSystemProcesses();
    setProcesses(_processes);
  }, []);

  useEffect(() => {
    const timerId = setInterval(getProcesses, 2000); // Fetches every 2 seconds
    return () => clearInterval(timerId);
  }, [getProcesses]);

  const filteredProcesses = useMemo(() => {
    const query = searchQuery.toLowerCase();
    if (!query) {
      return processes;
    }
    return processes.filter(
      (process) =>
        process.name.toLowerCase().includes(query) ||
        process.username.toLowerCase().includes(query) ||
        process.pid.toString().includes(query)
    );
  }, [processes, searchQuery]);

  const sortedProcesses = useMemo(() => {
    return [...filteredProcesses].sort((a, b) => {
      let comparison = 0;
      const aVal = a[sortField as keyof data.Process];
      const bVal = b[sortField as keyof data.Process];

      if (typeof aVal === "string" && typeof bVal === "string") {
        comparison = aVal.localeCompare(bVal);
      } else if (typeof aVal === "number" && typeof bVal === "number") {
        comparison = aVal - bVal;
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [filteredProcesses, sortField, sortDirection]);

  const handleSort = useCallback((field: SortField) => {
    setSortDirection((prevDirection) =>
      field === sortField && prevDirection === "asc" ? "desc" : "asc"
    );
    setSortField(field);
  }, [sortField]);

  const handleSearch = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  const handleKillProcess = useCallback(async () => {
    if (activeProcess) {
      await KillProcess(activeProcess.pid);
      setIsDialogOpen(false);
      setActiveProcess(null);
    }
  }, [activeProcess]);

  const handleRowClick = useCallback((process: data.Process) => {
    setActiveProcess(process);
    setIsDialogOpen(true);
  }, []);

  return (
    <Fragment>
      <Input
        onChange={(event) => handleSearch(event.target.value)}
        placeholder="Search by PID, Process Name, or User"
        className="mb-4"
      />
      <div className="rounded-lg border shadow-sm overflow-hidden">
        <div className="overflow-y-auto max-h-[calc(100vh-20rem)]">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0 z-10">
            <tr>
              {(["pid", "name", "username", "memoryUsage", "cpuUsage"] as SortField[]).map(
                (field) => (
                  <th
                    key={field}
                    scope="col"
                    className="px-4 py-3 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort(field)}
                  >
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                    {sortField === field && (
                      <span>{sortDirection === "asc" ? " ▲" : " ▼"}</span>
                    )}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {sortedProcesses.map((process) => (
              <tr
                key={process.pid}
                onClick={() => handleRowClick(process)}
                className="bg-white border-b hover:bg-gray-50 cursor-pointer"
              >
                <td className="px-4 py-2">{process.pid}</td>
                <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]">
                  {process.name}
                </td>
                <td className="px-4 py-2">{process.username}</td>
                <td className="px-4 py-2">{process.memoryUsage.toFixed(2)}%</td>
                <td className="px-4 py-2">{process.cpuUsage.toFixed(2)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Kill Process "{activeProcess?.name} - {activeProcess?.pid}"
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to kill this process? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleKillProcess}
              className="bg-red-600 hover:bg-red-700"
            >
              Kill
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Fragment>
  );
};

export default memo(Processes);
