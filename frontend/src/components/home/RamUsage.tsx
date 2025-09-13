import { data } from "@go/models";
import { useEffect, useState } from "react";
import { BsMemory } from "react-icons/bs";
import StatProgressBar from "./HomeProgress";

const RamUsage = ({ memoryStats }: { memoryStats: data.MemoryStats }) => {
  const [color, setColor] = useState("green");
  const [totalMemory, setTotalMemory] = useState(0);
  const [totalUsed, setTotalUsed] = useState(0);

  useEffect(() => {
    const percentage = memoryStats.usedPercentage;

    const totalMemory = Number(
      (memoryStats.total / Math.pow(1024, 3)).toFixed(2),
    );

    const totalUsed = Number((memoryStats.used / Math.pow(1024, 3)).toFixed(2));

    setTotalUsed(totalUsed);

    if (percentage < 50) {
      setColor("green");
    } else if (percentage >= 50 && percentage <= 70) {
      setColor("yellow");
    } else {
      setColor("red");
    }

    setTotalMemory(totalMemory);
  }, [memoryStats]);

  return (
    <div className="flex flex-col gap-2 text-sm">
      <div className="flex justify-between">
        <span className="text-gray-400">
          RAM: {totalMemory.toFixed(1)} Gb
        </span>
        <span className="text-gray-400">
          ({totalUsed.toFixed(1)} Gb) {memoryStats.usedPercentage.toFixed(2)}%
        </span>
      </div>
      <div className="flex items-center space-x-2">
        <StatProgressBar
          colorScheme={color}
          value={memoryStats.usedPercentage}
        />
      </div>
    </div>
  );
};

export default RamUsage;
