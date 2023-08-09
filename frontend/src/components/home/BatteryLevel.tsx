import { HStack, Progress, Text } from "@chakra-ui/react";
import { Notify } from "@go/main/App";
import { data } from "@go/models";
import { Fragment, useEffect, useState } from "react";
import { BsFillLightningChargeFill, BsPlug } from "react-icons/bs";

const BatteryLevel = ({
    batteryStats,
}: {
    batteryStats: data.BatteryStats;
}) => {
    const [color, setColor] = useState("green");
    const [chargingState, setChargingState] = useState(
        batteryStats.charginState,
    );
    const batteryLevel = batteryStats.currentPower;

    const [battNotifBuffer, setBattNotifBuffer] = useState([30, 20, 10, 5]);

    useEffect(() => {
        if (chargingState != batteryStats.charginState) {
            Notify(batteryStats.charginState);
            setChargingState(batteryStats.charginState);

            // Reset notif buffer if AC plugged in
            if (batteryStats.charginState === "Charging") {
                setBattNotifBuffer([30, 20, 10, 5]);
            }
        }

        if (batteryLevel > 50) {
            setColor("green");
        } else if (batteryLevel <= 50 && batteryLevel >= 30) {
            setColor("yellow");
        } else {
            setColor("red");
        }

        if (
            battNotifBuffer.includes(batteryLevel) &&
            batteryStats.charginState !== "Charging"
        ) {
            Notify(`Battery power at ${batteryLevel}%`);
            setBattNotifBuffer(
                battNotifBuffer.filter((x) => x !== batteryLevel),
            );
        }
    }, [batteryStats]);

    return (
        <Fragment>
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
        </Fragment>
    );
};

export default BatteryLevel;
