import { data } from "@go/models";
import { memo, useMemo } from "react";
import { BsDisc } from "react-icons/bs";
import StatProgressBar from "./HomeProgress";

interface DiskUsageProps {
  diskStats: data.DiskStats;
}

const DiskUsage = ({ diskStats }: DiskUsageProps) => {
  const { usedPercentage, total, used, path, device } = diskStats;

  const color = useMemo(() => {
    if (usedPercentage < 50) {
      return "green";
    } else if (usedPercentage >= 50 && usedPercentage <= 80) {
      return "yellow";
    } else {
      return "red";
    }
  }, [usedPercentage]);

  const totalDiskSpace = useMemo(
    () => Number((total / Math.pow(1024, 3)).toFixed(2)),
    [total]
  );

  const totalUsed = useMemo(
    () => Number((used / Math.pow(1024, 3)).toFixed(2)),
    [used]
  );

  return (
    <div className="flex flex-col gap-2">
      <div className="text-sm text-gray-500">
        <span>{path}</span>
        <span className="mx-2">||</span>
        <span>{totalDiskSpace.toFixed(1)} Gb</span>
        <span className="mx-2">||</span>
        <span>{device}</span>
      </div>
      <div className="flex items-center space-x-2">
        <BsDisc className="text-lg" />
        <StatProgressBar colorScheme={color} value={usedPercentage} />
        <span className="text-sm font-medium w-32 text-right">
          ({totalUsed} Gb) {usedPercentage.toFixed(2)}%
        </span>
      </div>
    </div>
  );
};

export default memo(DiskUsage);