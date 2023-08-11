import { HStack, Text } from "@chakra-ui/react";
import { data } from "@go/models";
import { Fragment, useEffect, useState } from "react";
import { BsDisc } from "react-icons/bs";
import StatProgressBar from "./HomeProgress";

const DiskUsage = ({ diskStats }: { diskStats: data.DiskStats }) => {
  const [color, setColor] = useState("green");
  const [totalDiskSpace, setTotalDiskSpace] = useState(0);
  const [totalUsed, setTotalUsed] = useState(0);

  useEffect(() => {
    const percentage = diskStats.usedPercentage;

    const totalDiskSpace = Number(
      (diskStats.total / Math.pow(1024, 3)).toFixed(2),
    );

    const totalUsed = Number((diskStats.used / Math.pow(1024, 3)).toFixed(2));

    setTotalUsed(totalUsed);

    if (percentage < 50) {
      setColor("green");
    } else if (percentage >= 50 && percentage <= 80) {
      setColor("yellow");
    } else {
      setColor("red");
    }

    setTotalDiskSpace(totalDiskSpace);
  }, [diskStats]);

  return (
    <Fragment>
      <Text>
        {diskStats.path} || {totalDiskSpace.toFixed(1)} Gb || {diskStats.device}
      </Text>
      <HStack>
        {<BsDisc />}
        <StatProgressBar colorScheme={color} value={diskStats.usedPercentage} />
        <Text>
          ({totalUsed} Gb) {diskStats.usedPercentage.toFixed(2)}%
        </Text>
      </HStack>
    </Fragment>
  );
};

export default DiskUsage;
