import { data } from "@go/models";
import { useEffect, useState } from "react";
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
    <div className="flex items-center space-x-2 text-sm">
      {batteryStats.chargingState === "Discharging" ? (
        <BsFillLightningChargeFill className="text-yellow-400" />
      ) : (
        <BsPlug className="text-green-500" />
      )}

      <StatProgressBar colorScheme={color} value={batteryLevel} />

      <span className="w-10 text-right">{batteryLevel}%</span>
    </div>
  );
};

export default BatteryLevel;
