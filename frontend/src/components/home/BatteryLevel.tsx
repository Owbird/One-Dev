import { HStack, Text } from "@chakra-ui/react";
import { Notify } from "@go/main/App";
import { data } from "@go/models";
import { Fragment, useEffect, useState } from "react";
import { BsFillLightningChargeFill, BsPlug } from "react-icons/bs";
import StatProgressBar from "./HomeProgress";

const BatteryLevel = ({
  batteryStats,
}: {
  batteryStats: data.BatteryStats;
}) => {
  const [color, setColor] = useState("green");
  const batteryLevel = batteryStats.currentPower;

  useEffect(() => {
    if (batteryLevel > 50) {
      setColor("green");
    } else if (batteryLevel <= 50 && batteryLevel >= 30) {
      setColor("yellow");
    } else {
      setColor("red");
    }
  }, [batteryStats]);

  return (
    <Fragment>
      <Text>Battery</Text>
      <HStack>
        {batteryStats.chargingState === "Discharging" ? (
          <BsFillLightningChargeFill />
        ) : (
          <BsPlug />
        )}

        <StatProgressBar colorScheme={color} value={batteryLevel} />

        <Text>{batteryLevel}%</Text>
      </HStack>
    </Fragment>
  );
};

export default BatteryLevel;
