import { HStack, Progress, Text } from "@chakra-ui/react";
import { data } from "@go/models";
import { useEffect, useState } from "react";
import { BsMemory } from "react-icons/bs";

const RamUsage = ({ memoryStats }: { memoryStats: data.MemoryStats }) => {
  const [color, setColor] = useState("green");
  const [totalMemory, setTotalMemory] = useState(0);
  const [totalUsed, setTotalUsed] = useState(0);

  useEffect(() => {
    const percentage = memoryStats.usedPercentage;

    const totalMemory = Number(
      (memoryStats.total / Math.pow(1024, 3)).toFixed(2)
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
    <>
      <Text>Ram: {totalMemory.toFixed(1)} Gb</Text>
      <HStack>
        {<BsMemory />}
        <Progress
          width={100}
          borderRadius={"md"}
          colorScheme={color}
          height="32px"
          value={memoryStats.usedPercentage}
        />
        <Text>
          ({totalUsed} Gb) {memoryStats.usedPercentage.toFixed(2)}%
        </Text>
      </HStack>
    </>
  );
};

export default RamUsage;
