import { HStack, Progress, Text } from "@chakra-ui/react";
import { data } from "@go/models";
import { useEffect, useState } from "react";
import { BsMemory } from "react-icons/bs";

const RamUsage = ({ memoryStats }: { memoryStats: data.MemoryStats }) => {
  const [color, setColor] = useState("green");
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    const percentage = Number(
      ((memoryStats.used / memoryStats.total) * 100).toFixed(2)
    );

    if (percentage < 50) {
      setColor("green");
    } else if (percentage >= 50 && percentage <= 70) {
      setColor("yellow");
    } else {
      setColor("red");
    }

    setPercentage(percentage);
  }, [memoryStats]);

  return (
    <>
      <Text>Ram: {Math.round(memoryStats.total / Math.pow(1024, 3))} Gb</Text>
      <HStack>
        {<BsMemory />}
        <Progress
          width={100}
          borderRadius={"md"}
          colorScheme={color}
          height="32px"
          value={percentage}
        />
        <Text>{percentage}%</Text>
      </HStack>
    </>
  );
};

export default RamUsage;
