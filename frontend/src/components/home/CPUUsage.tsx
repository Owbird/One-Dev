import { data } from "@go/models";
import { colors } from "@src/data/constants";
import StatProgressBar from "./HomeProgress";

const CPUUsage = ({ cpuStats }: { cpuStats: data.CPUStats }) => {
  return (
    <div className="flex flex-col gap-2 text-sm">
      <div className="flex justify-between text-gray-400">
        <span>{cpuStats.model}</span>
        <span>{cpuStats.cores} cores</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 max-h-64 overflow-y-auto p-1">
        {cpuStats.usages.map((cpu, index) => (
          <div key={index} className="flex items-center space-x-2">
            <span className="w-6 text-right text-gray-400">{index + 1}</span>
            <StatProgressBar
              colorScheme={colors[index % colors.length]}
              value={cpu}
            />
            <span className="w-12 text-right text-gray-400">
              {cpu.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CPUUsage;
