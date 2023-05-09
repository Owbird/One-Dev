import { VStack } from "@chakra-ui/react";
import { GetSystemStat, GetWakaToday } from "@go/main/App";
import { data } from "@go/models";
import BatteryLevel from "@src/components/home/BatteryLevel";
import CPUUsage from "@src/components/home/CPUUsage";
import Greeting from "@src/components/home/Greeting";
import Processess from "@src/components/home/Processess";
import RamUsage from "@src/components/home/RamUsage";
import UpTimeView from "@src/components/home/UpTimeView";
import WakaTimeToday from "@src/components/home/WakaTimeToday";
import { useEffect, useState } from "react";

const Home = () => {
  const [systemStats, setSystemStats] = useState<data.SystemStats>();
  const [wakaToday, setWakaToday] = useState("0");

  const _getSystemStat = async () => {
    const data = await GetSystemStat();
    setSystemStats(data);
  };

  const _getWakaToday = async () => {
    const data = await GetWakaToday();

    if (data !== "0") {
      const timerID = setInterval(async () => {
        const data = await GetWakaToday();
        setWakaToday(data);
      }, 1000 * 60 * 5);
    }

    setWakaToday(data);
  };

  useEffect(() => {
    _getWakaToday();
  }, []);

  useEffect(() => {
    const timerID = setInterval(() => _getSystemStat(), 1000);
    return () => clearInterval(timerID);
  }, []);

  return (
    <>
      <Greeting />
      {systemStats && (
        <>
          <VStack alignItems={"flex-start"}>
            <UpTimeView uptime={systemStats.uptime} />
            <WakaTimeToday time={wakaToday} />
            <BatteryLevel batteryStats={systemStats.batteryStats} />
            <RamUsage memoryStats={systemStats.memoryStats} />
            <CPUUsage cpuStats={systemStats.cpuStats} />
            <Processess processes={systemStats.processes} />
          </VStack>
        </>
      )}
    </>
  );
};

export default Home;
