import { HStack, Progress, Text } from "@chakra-ui/react";
import { Notify } from "@go/main/App";
import { data } from "@go/models";
import { useEffect, useState } from "react";
import { BsFillLightningChargeFill, BsPlug } from "react-icons/bs";

const BatteryLevel = ({
  batteryStats,
}: {
  batteryStats: data.BatteryStats;
}) => {
  const [color, setColor] = useState("green");
  const [chargingState, setChargingState] = useState(batteryStats.charginState);
  const batteryLevel = batteryStats.currentPower;

  useEffect(() => {
    if (chargingState != batteryStats.charginState) {
      Notify(batteryStats.charginState);
      setChargingState(batteryStats.charginState);
    }

    if (batteryLevel > 50) {
      setColor("green");
    } else if (batteryLevel <= 50 && batteryLevel >= 30) {
      setColor("yellow");
    } else {
      setColor("red");
    }
  }, [batteryStats]);

  return (
    <>
      <Text>Battery</Text>
      <HStack>
        {chargingState === "Discharging" ? (
          <BsFillLightningChargeFill />
        ) : (
          <BsPlug />
        )}
        <Progress
          width={100}
          borderRadius={"md"}
          colorScheme={color}
          height="32px"
          value={batteryLevel}
        />
        <Text>{batteryLevel}%</Text>
      </HStack>
    </>
  );
};

export default BatteryLevel;
